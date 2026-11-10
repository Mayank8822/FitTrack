package com.fitness.activity_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserValidationService {
    private final WebClient userServiceWebClient;

    public boolean validateUser(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);

        try {
            Boolean result = userServiceWebClient.get()
                    .uri("/api/users/{userId}/validate", userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();
            return Boolean.TRUE.equals(result);

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                log.warn("User Not Found: {}", userId);
            } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                log.warn("Invalid Request for user: {}", userId);
            }
        } catch (Exception e) {
            log.warn("User validation request failed for {}: {}", userId, e.getMessage());
        }

        return false;
    }

    public Map<String, Object> getUserProfile(String userId) {
        try {
            return userServiceWebClient.get()
                    .uri("/api/users/{userId}", userId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            log.warn("Could not fetch user profile for user {}: {}", userId, e.getMessage());
            return null;
        }
    }

    public boolean canShareActivities(String userId) {
        try {
            Map<String, Object> profile = getUserProfile(userId);
            return profile != null && Boolean.TRUE.equals(profile.get("shareActivities"));
        } catch (Exception e) {
            log.warn("Could not verify public sharing preference for user {}", userId, e);
            return false;
        }
    }
}
