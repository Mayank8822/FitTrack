package com.fitness.activity_service.repository;

import com.fitness.activity_service.model.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {
    List<Activity> findByUserId(String userId);
    List<Activity> findByUserIdIn(Collection<String> userIds);
    List<Activity> findByVisibilityOrderByStartTimeDesc(String visibility, Pageable pageable);
}
