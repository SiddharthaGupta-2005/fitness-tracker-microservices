package com.fitness.acitvityservices.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fitness.acitvityservices.model.ActivityType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityRequest {

    private String userId;
    private ActivityType type;
    private Integer duration;
    private Integer caloriesBurned;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS][.SS][.S][XXX][X][Z]", shape = JsonFormat.Shape.STRING)
    private LocalDateTime startTime;
    
    private Map<String,Object> additionalMetrics;
}
