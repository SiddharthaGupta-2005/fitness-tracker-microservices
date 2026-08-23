package com.fitness.aiservice.service;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public GeminiService(WebClient.Builder webClientBuilder){
            this.webClient= webClientBuilder.build();
    }

    public String getAnswer(String question){

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", question)
                        })
        }
        );
        String url = (geminiApiUrl != null ? geminiApiUrl.trim() : "") + (geminiApiKey != null ? geminiApiKey.trim() : "");
        String response = webClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .retryWhen(reactor.util.retry.Retry.backoff(3, java.time.Duration.ofSeconds(1))
                        .jitter(0.5)
                        .filter(throwable -> throwable != null && throwable.getMessage() != null && 
                                (throwable.getMessage().contains("503") || 
                                 throwable.getMessage().contains("429") || 
                                 throwable.getMessage().contains("ServerWebInputException") ||
                                 throwable.getMessage().contains("Connection"))))
                .block();

        return response;
    }

}
