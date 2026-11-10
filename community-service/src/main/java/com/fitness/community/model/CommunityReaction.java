package com.fitness.community.model;
import lombok.*; 
import org.springframework.data.annotation.Id; 
import org.springframework.data.mongodb.core.mapping.Document; 
import java.time.Instant;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document("community_reactions")
public class CommunityReaction {
 @Id private String id; 
 private String activityId; 
 private String userId; 
 private Instant createdAt;
}
