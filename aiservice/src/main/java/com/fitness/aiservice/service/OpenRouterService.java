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
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class OpenRouterService {

    private final WebClient webClient;

    @Value("${openrouter.api.url:https://openrouter.ai/api/v1/chat/completions}")
    private String apiUrl;

    @Value("${openrouter.api.key:${OPENROUTER_API_KEY:}}")
    private String apiKey;

    @Value("${openrouter.api.model:${OPENROUTER_MODEL:openrouter/free}}")
    private String customModel;

    // High-speed, free models on OpenRouter
    private static final List<String> CANDIDATE_MODELS = List.of(
            "openrouter/free",
            "meta-llama/llama-3.3-70b-instruct:free",
            "meta-llama/llama-3.1-8b-instruct:free",
            "mistralai/mistral-7b-instruct:free",
            "deepseek/deepseek-chat:free"
    );

    public OpenRouterService(WebClient.Builder webClientBuilder){
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question){
        return CompletableFuture.supplyAsync(() -> {
            String cleanUrl = apiUrl != null && !apiUrl.isBlank() 
                    ? apiUrl.trim() 
                    : "https://openrouter.ai/api/v1/chat/completions";
            String cleanKey = apiKey != null ? apiKey.trim() : "";

            log.info("AI Provider: OpenRouter, URL: {}, Key Present: {}", cleanUrl, !cleanKey.isEmpty());

            // Build list of models to try
            List<String> modelsToTry = new ArrayList<>();
            if (customModel != null && !customModel.isBlank()) {
                modelsToTry.add(customModel.trim());
            }
            for (String candidate : CANDIDATE_MODELS) {
                if (!modelsToTry.contains(candidate)) {
                    modelsToTry.add(candidate);
                }
            }

            Exception lastException = null;
            for (String currentModel : modelsToTry) {
                try {
                    log.info("Attempting OpenRouter request with model: {}", currentModel);
                    Map<String, Object> requestBody = Map.of(
                            "model", currentModel,
                            "messages", List.of(
                                    Map.of("role", "system", "content", "You are an elite fitness trainer and exercise scientist. Always respond strictly in valid JSON format matching the schema requested by the user."),
                                    Map.of("role", "user", "content", question)
                            ),
                            "temperature", 0.3,
                            "max_tokens", 1500
                    );

                    String response = webClient.post()
                            .uri(cleanUrl)
                            .header("Content-Type", "application/json")
                            .header("Authorization", "Bearer " + cleanKey)
                            .header("HTTP-Referer", "http://localhost:5173")
                            .header("X-Title", "FitPulse AI Fitness Tracker")
                            .bodyValue(requestBody)
                            .retrieve()
                            .onStatus(status -> status.isError(), clientResponse ->
                                    clientResponse.bodyToMono(String.class)
                                            .flatMap(errorBody -> {
                                                log.warn("OpenRouter Model [{}] Error [{}]: {}", currentModel, clientResponse.statusCode(), errorBody);
                                                return Mono.error(new RuntimeException("OpenRouter Error (" + currentModel + "): " + errorBody));
                                            })
                            )
                            .bodyToMono(String.class)
                            .retryWhen(reactor.util.retry.Retry.backoff(1, Duration.ofMillis(500))
                                    .filter(t -> t.getMessage() != null && (t.getMessage().contains("503") || t.getMessage().contains("429"))))
                            .block();

                    if (response != null && !response.isBlank()) {
                        log.info("Successfully generated AI coaching report with OpenRouter model: {}", currentModel);
                        return response;
                    }
                } catch (Exception ex) {
                    lastException = ex;
                    log.warn("Model {} failed ({}), trying next available OpenRouter model...", currentModel, ex.getMessage());
                }
            }

            throw new RuntimeException("All candidate OpenRouter models failed. Last error: " + (lastException != null ? lastException.getMessage() : "Unknown"));
        }).join();
    }
}
