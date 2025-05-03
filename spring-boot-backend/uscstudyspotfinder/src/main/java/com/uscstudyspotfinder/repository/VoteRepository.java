package com.uscstudyspotfinder.repository;

import com.uscstudyspotfinder.model.Vote;
import com.uscstudyspotfinder.model.VoteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, VoteId> {
    
    boolean existsById(VoteId id);
    
    @Query("SELECT v FROM Vote v WHERE v.id.userId = :userId")
    List<Vote> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT v FROM Vote v WHERE v.id.spotId = :spotId")
    List<Vote> findBySpotId(@Param("spotId") Long spotId);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.id.spotId = :spotId AND v.voteType = 'upvote'")
    long countUpvotesBySpotId(@Param("spotId") Long spotId);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.id.spotId = :spotId AND v.voteType = 'downvote'")
    long countDownvotesBySpotId(@Param("spotId") Long spotId);
    
    @Modifying
    @Query("DELETE FROM Vote v WHERE v.id.spotId = :spotId")
    void deleteBySpotId(@Param("spotId") Long spotId);
    
    @Modifying
    @Query("DELETE FROM Vote v WHERE v.id.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    
    @Query("SELECT v.voteType FROM Vote v WHERE v.id.userId = :userId AND v.id.spotId = :spotId")
    String findVoteTypeByUserAndSpot(@Param("userId") Long userId, @Param("spotId") Long spotId);
}