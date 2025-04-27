package com.uscstudyspotfinder.repository;

// Ensure the correct package path for FavoriteSpot
import com.uscstudyspotfinder.model.FavSpot; // Update to the correct package if necessary
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavSpotRepository extends JpaRepository<FavSpot, Long> {
    // Find all favorite spots for a specific user
    List<FavSpot> findByUserId(Long userId);

    // Check if a specific spot is marked as favorite by a user
    boolean existsByUserIdAndSpotId(Long userId, Long spotId);

    // Delete a favorite spot by userId and spotId
    void deleteByUserIdAndSpotId(Long userId, Long spotId);
}
