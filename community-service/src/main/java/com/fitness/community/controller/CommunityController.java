package com.fitness.community.controller;

import com.fitness.community.model.*;
import com.fitness.community.repository.*;
import jakarta.validation.Valid; 
import jakarta.validation.constraints.NotBlank; 
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.*; 
import org.springframework.web.bind.annotation.*; 
import org.springframework.web.reactive.function.client.WebClient;
import java.time.Instant; 
import java.util.*;

@RestController @RequestMapping("/api/community") @RequiredArgsConstructor
public class CommunityController {
 private final CommunityCommentRepository comments; private final CommunityReactionRepository reactions;
 private final UserFollowRepository follows; private final WebClient activityClient;

 public record CommentRequest(@NotBlank @Size(max=500) String content) {}
 @GetMapping("/feed") public List<Map> feed(@RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size){
   int safePage=Math.max(0,page); int safeSize=Math.max(1,Math.min(size,50));
   List<Map> items=activityClient.get().uri(uriBuilder -> uriBuilder.path("/api/activities/public").queryParam("page",safePage).queryParam("size",safeSize).build()).retrieve().bodyToFlux(Map.class).collectList().block();
   if(items==null) return List.of();
   for(Map item:items){
     Object id=item.get("id");
     if(id!=null){
       item.put("likes",reactions.countByActivityId(id.toString()));
       item.put("comments",comments.findByActivityIdOrderByCreatedAtAsc(id.toString()));
       item.remove("caloriesBurned");
     }
   }
   return items;
 }
 private void requirePublicActivity(String activityId) {
   try { activityClient.get().uri("/api/activities/public/{id}", activityId).retrieve().toBodilessEntity().block(); }
   catch (Exception e) { throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Public activity not found"); }
 }
 @PostMapping("/activities/{activityId}/like") public ResponseEntity<Void> like(@PathVariable String activityId,@RequestHeader("X-User-ID") String userId){
   requirePublicActivity(activityId);
   if(!reactions.existsByActivityIdAndUserId(activityId,userId)) reactions.save(CommunityReaction.builder().activityId(activityId).userId(userId).createdAt(Instant.now()).build());
   return ResponseEntity.noContent().build();
 }
 @DeleteMapping("/activities/{activityId}/like") public ResponseEntity<Void> unlike(@PathVariable String activityId,@RequestHeader("X-User-ID") String userId){
   requirePublicActivity(activityId);
   reactions.deleteByActivityIdAndUserId(activityId,userId); return ResponseEntity.noContent().build();
 }
 @PostMapping("/activities/{activityId}/comments") public CommunityComment comment(@PathVariable String activityId,@RequestHeader("X-User-ID") String userId,@Valid @RequestBody CommentRequest body){
   requirePublicActivity(activityId);
   return comments.save(CommunityComment.builder().activityId(activityId).userId(userId).content(body.content().trim()).createdAt(Instant.now()).build());
 }
 @GetMapping("/activities/{activityId}/comments") public List<CommunityComment> comments(@PathVariable String activityId){ requirePublicActivity(activityId); return comments.findByActivityIdOrderByCreatedAtAsc(activityId); }
 @PostMapping("/follow/{targetUserId}") public ResponseEntity<Void> follow(@PathVariable String targetUserId,@RequestHeader("X-User-ID") String userId){
   if(userId.equals(targetUserId)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"You cannot follow yourself");
   if(!follows.existsByFollowerIdAndFollowedId(userId,targetUserId)) follows.save(UserFollow.builder().followerId(userId).followedId(targetUserId).createdAt(Instant.now()).build());
   return ResponseEntity.noContent().build();
 }
 @DeleteMapping("/follow/{targetUserId}") public ResponseEntity<Void> unfollow(@PathVariable String targetUserId,@RequestHeader("X-User-ID") String userId){
   follows.deleteByFollowerIdAndFollowedId(userId,targetUserId); return ResponseEntity.noContent().build();
 }
 @GetMapping("/following") public List<String> following(@RequestHeader("X-User-ID") String userId){ return follows.findByFollowerId(userId).stream().map(UserFollow::getFollowedId).toList(); }
}
