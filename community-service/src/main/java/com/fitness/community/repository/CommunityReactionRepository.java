package com.fitness.community.repository;
import com.fitness.community.model.CommunityReaction; import org.springframework.data.mongodb.repository.MongoRepository; import java.util.List;
public interface CommunityReactionRepository extends MongoRepository<CommunityReaction,String> {
 boolean existsByActivityIdAndUserId(String activityId,String userId);
 void deleteByActivityIdAndUserId(String activityId,String userId);
 long countByActivityId(String activityId);
}
