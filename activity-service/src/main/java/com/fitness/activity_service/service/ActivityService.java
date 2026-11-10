package com.fitness.activity_service.service;

import com.fitness.activity_service.dto.ActivityRequest;
import com.fitness.activity_service.dto.ActivityResponse;
import com.fitness.activity_service.model.Activity;
import com.fitness.activity_service.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.PageRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;
    private final WebClient aiServiceWebClient;
    @Value("${rabbitmq.exchange.name}") private String exchange;
    @Value("${rabbitmq.routing.key}") private String routingKey;

    public ActivityResponse trackActivity(ActivityRequest request) {
        if (request.getUserId() == null || !userValidationService.validateUser(request.getUserId()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authenticated user");
        String visibility = "PUBLIC".equalsIgnoreCase(request.getVisibility()) ? "PUBLIC" : "PRIVATE";
        if ("PUBLIC".equals(visibility) && !userValidationService.canShareActivities(request.getUserId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Enable public activity sharing in your fitness profile first");
        Activity activity = Activity.builder().userId(request.getUserId()).type(request.getType())
                .duration(request.getDuration()).caloriesBurned(request.getCaloriesBurned())
                .distanceKm(request.getDistanceKm())
                .visibility(visibility)
                .startTime(request.getStartTime()).additionalMetrics(request.getAdditionalMetrics()).build();
        Activity saved = activityRepository.save(activity);
        rabbitTemplate.convertAndSend(exchange, routingKey, saved);
        return map(saved);
    }

    private ActivityResponse map(Activity a) {
        ActivityResponse r = new ActivityResponse();
        r.setId(a.getId()); r.setUserId(a.getUserId()); r.setType(a.getType());
        r.setDuration(a.getDuration()); r.setCaloriesBurned(a.getCaloriesBurned());
        r.setDistanceKm(a.getDistanceKm()); r.setVisibility(a.getVisibility() == null ? "PRIVATE" : a.getVisibility());
        r.setStartTime(a.getStartTime()); r.setAdditionalMetrics(a.getAdditionalMetrics());
        r.setCreatedAt(a.getCreatedAt()); r.setUpdatedAt(a.getUpdatedAt()); return r;
    }

    private Set<String> resolveUserIdentifiers(String userId) {
        Set<String> ids = new LinkedHashSet<>();
        if (userId != null && !userId.isBlank()) {
            ids.add(userId);
        }
        try {
            Map<String, Object> profile = userValidationService.getUserProfile(userId);
            if (profile != null) {
                if (profile.get("id") != null) ids.add(String.valueOf(profile.get("id")));
                if (profile.get("keycloakId") != null) ids.add(String.valueOf(profile.get("keycloakId")));
                if (profile.get("email") != null) ids.add(String.valueOf(profile.get("email")));
            }
        } catch (Exception e) {
            log.warn("Could not resolve alternate identifiers for user {}: {}", userId, e.getMessage());
        }
        return ids;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        Set<String> userIds = resolveUserIdentifiers(userId);
        List<Activity> activities = activityRepository.findByUserIdIn(userIds);

        // Auto-heal: If any existing activities were stored with an alternate ID, link them to the active userId
        for (Activity a : activities) {
            if (!userId.equals(a.getUserId())) {
                a.setUserId(userId);
                try {
                    activityRepository.save(a);
                } catch (Exception e) {
                    log.warn("Failed to auto-update activity {} to userId {}: {}", a.getId(), userId, e.getMessage());
                }
            }
        }

        return activities.stream().map(this::map).toList();
    }

    public List<ActivityResponse> getPublicActivities(int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.max(1, Math.min(size, 50));
        return activityRepository.findByVisibilityOrderByStartTimeDesc("PUBLIC", PageRequest.of(safePage, safeSize)).stream()
                .map(this::map)
                .peek(response -> response.setCaloriesBurned(null))
                .toList();
    }

    public ActivityResponse getPublicActivityById(String id) {
        Activity a = activityRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found"));
        if (!"PUBLIC".equals(a.getVisibility())) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Public activity not found");
        ActivityResponse response = map(a);
        response.setCaloriesBurned(null);
        return response;
    }

    public ActivityResponse getActivityById(String id, String userId) {
        Activity a = activityRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found"));
        Set<String> userIds = resolveUserIdentifiers(userId);
        if (!userIds.contains(a.getUserId()) && !"PUBLIC".equals(a.getVisibility()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Private activity");
        return map(a);
    }

    public void deleteActivity(String id, String userId) {
        Activity a = activityRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found"));
        Set<String> userIds = resolveUserIdentifiers(userId);
        if (!userIds.contains(a.getUserId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot delete another user's activity");
        activityRepository.delete(a);
        try {
            aiServiceWebClient.delete().uri("/api/recommendations/activity/{id}", id).retrieve().toBodilessEntity().block();
        } catch (Exception e) { log.warn("Recommendation cleanup failed for activity {}", id, e); }
    }
}
