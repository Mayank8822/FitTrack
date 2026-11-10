package com.fitness.community.repository;
import com.fitness.community.model.UserFollow; import org.springframework.data.mongodb.repository.MongoRepository; import java.util.List;
public interface UserFollowRepository extends MongoRepository<UserFollow,String> {
 boolean existsByFollowerIdAndFollowedId(String followerId,String followedId);
 void deleteByFollowerIdAndFollowedId(String followerId,String followedId);
 List<UserFollow> findByFollowerId(String followerId);
}
