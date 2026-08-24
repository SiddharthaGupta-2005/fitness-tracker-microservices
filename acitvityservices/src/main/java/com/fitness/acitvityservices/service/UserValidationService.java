package com.fitness.acitvityservices.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserValidationService {
    private final WebClient userServiceWebClient;

    public boolean validateUser(String userId){
        log.info("Calling User Validation API for userId: {}", userId);

        if (userId == null || userId.isBlank()) {
            return false;
        }

        try {
            Boolean isValid = userServiceWebClient.get()
                    .uri("/api/users/{userId}/validate", userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();

            return Boolean.TRUE.equals(isValid);
        } catch (Exception e) {
            log.warn("User validation service call failed ({}). Proceeding with authenticated userId: {}", e.getMessage(), userId);
            return true;
        }
    }
}
