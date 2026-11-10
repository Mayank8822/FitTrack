package com.fitness.user_service.repository;

import com.fitness.user_service.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User,String> {
    boolean existsByEmail(String email);

    Boolean existsByKeycloakId(String userId);
    java.util.Optional<User> findByKeycloakId(String userId);

    User findByEmail(@NotBlank(message = "Email is required") @Email(message = "Email should be valid") String email);
}
