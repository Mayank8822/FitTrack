package com.fitness.activity_service.dto;

import com.fitness.activity_service.model.ActivityType;
import lombok.Data;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityRequest {
    private String userId;
    @NotNull private ActivityType type;
    @NotNull @Min(1) @Max(1440) private Integer duration;
    @NotNull @Min(0) @Max(20000) private Integer caloriesBurned;
    @DecimalMin("0.0") @DecimalMax("1000.0") private Double distanceKm;
    private String visibility = "PRIVATE";
    private LocalDateTime startTime;
    private Map<String, Object> additionalMetrics;
}
