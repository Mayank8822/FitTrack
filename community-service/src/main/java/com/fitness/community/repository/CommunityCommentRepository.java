package com.fitness.community.repository;
import com.fitness.community.model.CommunityComment; import org.springframework.data.mongodb.repository.MongoRepository; import java.util.List;
public interface CommunityCommentRepository extends MongoRepository<CommunityComment,String> {
 List<CommunityComment> findByActivityIdOrderByCreatedAtAsc(String activityId);
}
