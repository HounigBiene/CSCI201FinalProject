package com.uscstudyspotfinder.repository;

import com.uscstudyspotfinder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {    
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

    // find friends by email
    @Query("SELECT u FROM User u WHERE u.email LIKE %:email%")
    List<User> findUsersByEmail(@Param("email") String email);
}
