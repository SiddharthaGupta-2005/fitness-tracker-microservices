package com.fitness.aiservice.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Activity {

    private String id;
    private String userId;
    private String type;
    private Integer duration;
    
    @JsonAlias({"calories", "caloriesBurned"})
    private Integer caloriesBurned;
    
    private LocalDateTime startTime;
    private Map<String,Object> additionalMetrics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
