package com.fitness.aiservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
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

    @Value("${groq.api.model:${GROQ_MODEL:}}")
    private String groqModel;

    // Ordered list of candidate models supported by Groq
    private static final List<String> CANDIDATE_MODELS = List.of(
            "llama-3.1-8b-instant",
            "llama-3.3-70b-versatile",
            "llama3-8b-8192",
            "llama3-70b-8192",
            "gemma2-9b-it",
            "mixtral-8x7b-32768",
            "qwen/qwen3.6-27b"
    );

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
                isGroqOrOpenAI ? "Groq AI" : "Legacy AI", 
                cleanUrl, 
                !cleanKey.isEmpty());

        if (isGroqOrOpenAI) {
            // Build list of models to try
            List<String> modelsToTry = new ArrayList<>();
            if (groqModel != null && !groqModel.isBlank()) {
                modelsToTry.add(groqModel.trim());
            }
            for (String candidate : CANDIDATE_MODELS) {
                if (!modelsToTry.contains(candidate)) {
                    modelsToTry.add(candidate);
                }
            }

            Exception lastException = null;
            for (String currentModel : modelsToTry) {
                try {
                    log.info("Attempting Groq AI request with model: {}", currentModel);
                    Map<String, Object> requestBody = Map.of(
                            "model", currentModel,
                            "messages", List.of(
                                    Map.of("role", "system", "content", "You are an elite fitness trainer and exercise scientist. Always respond strictly in valid JSON format matching the schema requested by the user."),
                                    Map.of("role", "user", "content", question)
                            ),
                            "response_format", Map.of("type", "json_object"),
                            "temperature", 0.3
                    );

                    String response = webClient.post()
                            .uri(cleanUrl)
                            .header("Content-Type", "application/json")
                            .header("Authorization", "Bearer " + cleanKey)
                            .bodyValue(requestBody)
                            .retrieve()
                            .onStatus(status -> status.isError(), clientResponse ->
                                    clientResponse.bodyToMono(String.class)
                                            .flatMap(errorBody -> {
                                                log.warn("Groq Model [{}] Error [{}]: {}", currentModel, clientResponse.statusCode(), errorBody);
                                                return Mono.error(new RuntimeException("Groq Error (" + currentModel + "): " + errorBody));
                                            })
                            )
                            .bodyToMono(String.class)
                            .retryWhen(reactor.util.retry.Retry.backoff(1, Duration.ofMillis(500))
                                    .filter(t -> t.getMessage() != null && (t.getMessage().contains("503") || t.getMessage().contains("429"))))
                            .block();

                    if (response != null && !response.isBlank()) {
                        log.info("Successfully generated AI coaching report with Groq model: {}", currentModel);
                        return response;
                    }
                } catch (Exception ex) {
                    lastException = ex;
                    log.warn("Model {} failed ({}), trying next available Groq model...", currentModel, ex.getMessage());
                }
            }

            throw new RuntimeException("All candidate Groq models failed. Last error: " + (lastException != null ? lastException.getMessage() : "Unknown"));
        } else {
            // Legacy / Fallback Request
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
                    .bodyToMono(String.class)
                    .block();
        }
    }
}
