package com.fitness.activity_service.controller;

import com.fitness.activity_service.dto.ActivityRequest;
import com.fitness.activity_service.dto.ActivityResponse;
import com.fitness.activity_service.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/activities") @RequiredArgsConstructor
public class ActivityController {
    private final ActivityService activityService;
    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(@Valid @RequestBody ActivityRequest request,
            @RequestHeader("X-User-ID") String userId) {
        request.setUserId(userId);
        return ResponseEntity.ok(activityService.trackActivity(request));
    }
    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities(@RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }
    @GetMapping("/public")
    public ResponseEntity<List<ActivityResponse>> getPublicActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(activityService.getPublicActivities(page, size));
    }
    @GetMapping("/public/{activityId}")
    public ResponseEntity<ActivityResponse> getPublicActivity(@PathVariable String activityId) {
        return ResponseEntity.ok(activityService.getPublicActivityById(activityId));
    }
    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivity(@PathVariable String activityId,
            @RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(activityService.getActivityById(activityId, userId));
    }
    @DeleteMapping("/{activityId}")
    public ResponseEntity<Void> deleteActivity(@PathVariable String activityId,
            @RequestHeader("X-User-ID") String userId) {
        activityService.deleteActivity(activityId, userId);
        return ResponseEntity.noContent().build();
    }
}
