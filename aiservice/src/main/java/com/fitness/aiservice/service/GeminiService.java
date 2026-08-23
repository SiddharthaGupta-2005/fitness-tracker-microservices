package com.fitness.aiservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url:${groq.api.url:${GROQ_API_URL:https://api.groq.com/openai/v1/chat/completions}}}")
    private String geminiApiUrl;

    @Value("${groq.api.key:${gemini.api.key:${GROQ_API_KEY:${GEMINI_API_KEY:}}}}")
    private String geminiApiKey;

    public GeminiService(WebClient.Builder webClientBuilder){
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question){
        String cleanUrl = geminiApiUrl != null && !geminiApiUrl.isBlank() 
                ? geminiApiUrl.trim() 
                : "https://api.groq.com/openai/v1/chat/completions";
        String cleanKey = geminiApiKey != null ? geminiApiKey.trim() : "";

        boolean isGroqOrOpenAI = cleanUrl.contains("groq.com") || cleanUrl.contains("openai") || cleanUrl.contains("openrouter");

        log.info("AI Provider: {}, URL: {}, Key Present: {}", 
                isGroqOrOpenAI ? "Groq/OpenAI" : "Google Gemini", 
                cleanUrl, 
                !cleanKey.isEmpty());

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

            return webClient.post()
                    .uri(cleanUrl)
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + cleanKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> status.isError(), clientResponse ->
                            clientResponse.bodyToMono(String.class)
                                    .flatMap(errorBody -> {
                                        log.error("Groq API Error Response [{}]: {}", clientResponse.statusCode(), errorBody);
                                        return Mono.error(new RuntimeException("Groq API Error " + clientResponse.statusCode() + ": " + errorBody));
                                    })
                    )
                    .bodyToMono(String.class)
                    .retryWhen(reactor.util.retry.Retry.backoff(2, Duration.ofMillis(800))
                            .filter(throwable -> throwable != null && throwable.getMessage() != null &&
                                    (throwable.getMessage().contains("503") || throwable.getMessage().contains("429"))))
                    .block();
        } else {
            // Google Gemini Request
            Map<String, Object> requestBody = Map.of(
                    "contents", new Object[]{
                            Map.of("parts", new Object[]{
                                    Map.of("text", question)
                            })
                    }
            );
            String fullUrl = cleanUrl + cleanKey;

            return webClient.post()
                    .uri(fullUrl)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> status.isError(), clientResponse ->
                            clientResponse.bodyToMono(String.class)
                                    .flatMap(errorBody -> {
                                        log.error("Gemini API Error Response [{}]: {}", clientResponse.statusCode(), errorBody);
                                        return Mono.error(new RuntimeException("Gemini API Error " + clientResponse.statusCode() + ": " + errorBody));
                                    })
                    )
                    .bodyToMono(String.class)
                    .retryWhen(reactor.util.retry.Retry.backoff(3, Duration.ofSeconds(1))
                            .jitter(0.5)
                            .filter(throwable -> throwable != null && throwable.getMessage() != null &&
                                    (throwable.getMessage().contains("503") || throwable.getMessage().contains("429"))))
                    .block();
        }
    }
}
