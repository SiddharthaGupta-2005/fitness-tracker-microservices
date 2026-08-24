package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;
    private final ActivityAIService activityAIService;
    private final WebClient.Builder webClientBuilder;

    @Value("${activity.service.url:http://localhost:8080/api/activities}")
    private String activityServiceUrl;

    public List<Recommendation> getUserRecommendation(String userId) {
        return recommendationRepository.findByUserId(userId);
    }

    public Optional<Recommendation> getActivityRecommendation(String activityId) {
        Optional<Recommendation> existing = recommendationRepository.findByActivityId(activityId);
        
        // If recommendation exists and is high-quality (not the fallback error message), return it
        if (existing.isPresent() && existing.get().getRecommendation() != null 
                && !existing.get().getRecommendation().contains("Unable to generate detailed analysis")) {
            return existing;
        }

        // Run on-demand generation in a separate thread pool so Reactor Netty threads are not blocked
        try {
            return CompletableFuture.supplyAsync(() -> {
                try {
                    log.info("On-demand AI report requested for activity ID: {}", activityId);
                    Activity activity = webClientBuilder.build()
                            .get()
                            .uri(activityServiceUrl + "/" + activityId)
                            .retrieve()
                            .bodyToMono(Activity.class)
                            .block();

                    if (activity != null) {
                        Recommendation freshRec = activityAIService.generateRecommendation(activity);
                        if (freshRec != null) {
                            if (existing.isPresent()) {
                                freshRec.setId(existing.get().getId());
                            }
                            Recommendation saved = recommendationRepository.save(freshRec);
                            log.info("Successfully generated and saved on-demand AI recommendation for activity: {}", activityId);
                            return Optional.of(saved);
                        }
                    }
                } catch (Exception e) {
                    log.warn("On-demand AI generation failed for activity {}: {}", activityId, e.getMessage());
                }
                return existing;
            }).join();
        } catch (Exception ex) {
            log.warn("Could not execute on-demand AI report for activity {}: {}", activityId, ex.getMessage());
            return existing;
        }
    }
}
