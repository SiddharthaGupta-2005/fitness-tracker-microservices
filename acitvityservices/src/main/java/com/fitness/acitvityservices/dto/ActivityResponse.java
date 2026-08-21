package com.fitness.acitvityservices.dto;

import com.fitness.acitvityservices.model.ActivityType;
import lombok.Data;


import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityResponse {

    private String id;
    private String userId;
    private ActivityType type;
    private Integer duration;
    private Integer calories;
    private LocalDateTime startTime;
    private Map<String,Object> additionalMetrics;
    private LocalDateTime CreatedAt;
    private LocalDateTime UpdatedAt;
}
