package com.fitness.ai_service.controller;

import com.fitness.ai_service.model.Recommendation;
import com.fitness.ai_service.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>> getUserRecommendations(@PathVariable String userId) {
        return ResponseEntity.ok(recommendationService.getUserRecommendation(userId));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<Recommendation> getActivityRecommendations(@PathVariable String activityId) {
        return ResponseEntity.ok(recommendationService.getActivityRecommendation(activityId));
    }

    @DeleteMapping("/activity/{activityId}")
    public ResponseEntity<Void> deleteActivityRecommendation(
            @PathVariable String activityId) {

        recommendationService.deleteActivityRecommendation(activityId);

        return ResponseEntity.noContent().build();
    }
}
