package com.fitness.community.model;
import lombok.*; 
import org.springframework.data.annotation.Id; 
import org.springframework.data.mongodb.core.mapping.Document; 
import java.time.Instant;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document("user_follows")
public class UserFollow {
 @Id private String id; private String followerId; private String followedId; private Instant createdAt;
}
