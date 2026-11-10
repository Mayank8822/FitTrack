package com.fitness.user_service.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FitnessProfileRequest {
    @Min(13) @Max(110) private Integer age;
    @DecimalMin("80.0") @DecimalMax("250.0") private Double heightCm;
    @DecimalMin("25.0") @DecimalMax("350.0") private Double weightKg;
    @Pattern(regexp = "BEGINNER|INTERMEDIATE|ADVANCED") private String fitnessLevel;
    @Pattern(regexp = "WEIGHT_LOSS|MUSCLE_GAIN|ENDURANCE|GENERAL_FITNESS|STRENGTH|FLEXIBILITY") private String fitnessGoal;
    @Min(1000) @Max(50000) private Integer dailyStepGoal;
    @Min(500) @Max(10000) private Integer dailyCalorieGoal;
    private Boolean profilePublic;
    private Boolean shareActivities;
    private Boolean showWeight;
    private Boolean showCalories;
}
