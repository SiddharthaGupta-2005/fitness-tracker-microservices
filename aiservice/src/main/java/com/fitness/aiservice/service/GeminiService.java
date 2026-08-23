package com.fitness.aiservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String geminiApiUrl;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    public GeminiService(WebClient.Builder webClientBuilder){
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question){
        String cleanUrl = geminiApiUrl != null ? geminiApiUrl.trim() : "https://api.groq.com/openai/v1/chat/completions";
        String cleanKey = geminiApiKey != null ? geminiApiKey.trim() : "";

        boolean isGroqOrOpenAI = cleanUrl.contains("groq.com") || cleanUrl.contains("openai") || cleanUrl.contains("openrouter");

        if (isGroqOrOpenAI) {
            // Groq / OpenAI Compatible Request
            Map<String, Object> requestBody = Map.of(
                    "model", "llama-3.3-70b-versatile",
                    "messages", List.of(
                            Map.of("role", "system", "content", "You are an elite fitness trainer and exercise scientist. Always respond strictly in valid JSON format matching the schema requested by the user."),
                            Map.of("role", "user", "content", question)
                    ),
                    "response_format", Map.of("type", "json_object"),
                    "temperature", 0.3
            );

            log.info("Sending request to Groq AI: {}", cleanUrl);

            return webClient.post()
                    .uri(cleanUrl)
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + cleanKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .retryWhen(reactor.util.retry.Retry.backoff(2, Duration.ofMillis(800))
                            .filter(throwable -> throwable != null && throwable.getMessage() != null &&
                                    (throwable.getMessage().contains("503") || throwable.getMessage().contains("429"))))
                    .block();
        } else {
            // Legacy Google Gemini Request
            Map<String, Object> requestBody = Map.of(
                    "contents", new Object[]{
                            Map.of("parts", new Object[]{
                                    Map.of("text", question)
                            })
                    }
            );
            String fullUrl = cleanUrl + cleanKey;
            log.info("Sending request to Google Gemini AI: {}", cleanUrl);

            return webClient.post()
                    .uri(fullUrl)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .retryWhen(reactor.util.retry.Retry.backoff(3, Duration.ofSeconds(1))
                            .jitter(0.5)
                            .filter(throwable -> throwable != null && throwable.getMessage() != null &&
                                    (throwable.getMessage().contains("503") || throwable.getMessage().contains("429"))))
                    .block();
        }
    }
}
