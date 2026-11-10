package com.fitness.user_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private String id;
    private String keycloakId;
    private String email;
    private String firstName;
    private String lastName;
    private Integer age;
    private Double heightCm;
    private Double weightKg;
    private String fitnessLevel;
    private String fitnessGoal;
    private Integer dailyStepGoal;
    private Integer dailyCalorieGoal;
    private Boolean profilePublic;
    private Boolean shareActivities;
    private Boolean showWeight;
    private Boolean showCalories;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
