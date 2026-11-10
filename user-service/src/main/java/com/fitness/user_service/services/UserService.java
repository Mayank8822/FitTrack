package com.fitness.user_service.services;

import com.fitness.user_service.dto.*;
import com.fitness.user_service.model.User;
import com.fitness.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        User user = repository.findByEmail(request.getEmail());
        if (user == null) {
            user = new User();
            user.setEmail(request.getEmail());
        }
        // Passwords are never persisted here; Keycloak is the identity provider.
        user.setKeycloakId(request.getKeycloakId());
        user.setPassword(null);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        return toResponse(repository.save(user));
    }

    public UserResponse getUserProfile(String userId) {
        return repository.findByKeycloakId(userId)
                .map(this::toResponse)
                .orElseGet(() -> repository.findById(userId).map(this::toResponse)
                        .orElseThrow(() -> new IllegalArgumentException("User not found")));
    }

    @Transactional
    public UserResponse updateFitnessProfile(String userId, FitnessProfileRequest request) {
        User user = repository.findByKeycloakId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getHeightCm() != null) user.setHeightCm(request.getHeightCm());
        if (request.getWeightKg() != null) user.setWeightKg(request.getWeightKg());
        if (request.getFitnessLevel() != null) user.setFitnessLevel(request.getFitnessLevel());
        if (request.getFitnessGoal() != null) user.setFitnessGoal(request.getFitnessGoal());
        if (request.getDailyStepGoal() != null) user.setDailyStepGoal(request.getDailyStepGoal());
        if (request.getDailyCalorieGoal() != null) user.setDailyCalorieGoal(request.getDailyCalorieGoal());
        if (request.getProfilePublic() != null) user.setProfilePublic(request.getProfilePublic());
        if (request.getShareActivities() != null) user.setShareActivities(request.getShareActivities());
        if (request.getShowWeight() != null) user.setShowWeight(request.getShowWeight());
        if (request.getShowCalories() != null) user.setShowCalories(request.getShowCalories());
        return toResponse(repository.save(user));
    }

    public Boolean existByUserId(String userId) {
        return repository.existsByKeycloakId(userId);
    }

    private UserResponse toResponse(User user) {
        UserResponse r = new UserResponse();
        r.setId(user.getId()); r.setKeycloakId(user.getKeycloakId());
        r.setEmail(user.getEmail()); r.setFirstName(user.getFirstName()); r.setLastName(user.getLastName());
        r.setAge(user.getAge()); r.setHeightCm(user.getHeightCm()); r.setWeightKg(user.getWeightKg());
        r.setFitnessLevel(user.getFitnessLevel()); r.setFitnessGoal(user.getFitnessGoal());
        r.setDailyStepGoal(user.getDailyStepGoal()); r.setDailyCalorieGoal(user.getDailyCalorieGoal());
        r.setProfilePublic(Boolean.TRUE.equals(user.getProfilePublic()));
        r.setShareActivities(Boolean.TRUE.equals(user.getShareActivities()));
        r.setShowWeight(Boolean.TRUE.equals(user.getShowWeight()));
        r.setShowCalories(Boolean.TRUE.equals(user.getShowCalories()));
        r.setCreatedAt(user.getCreatedAt()); r.setUpdatedAt(user.getUpdatedAt());
        return r;
    }
}
