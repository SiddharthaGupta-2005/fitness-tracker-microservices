package com.fitness.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Value("${USER_SERVICE_URI:http://userservices:8081}")
    private String userServiceUri;

    @Value("${ACTIVITY_SERVICE_URI:http://acitvityservices:8082}")
    private String activityServiceUri;

    @Value("${AI_SERVICE_URI:http://aiservice:8083}")
    private String aiServiceUri;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r.path("/api/users/**")
                        .uri(userServiceUri))
                .route("activity-service", r -> r.path("/api/activities/**")
                        .uri(activityServiceUri))
                .route("ai-service", r -> r.path("/api/recommendations/**")
                        .uri(aiServiceUri))
                .build();
    }
}
