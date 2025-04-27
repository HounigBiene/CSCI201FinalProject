package com.uscstudyspotfinder.repository;

import com.uscstudyspotfinder.model.Vote;
import com.uscstudyspotfinder.model.VoteId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, VoteId> {
    
    boolean existsById(VoteId id); // Check if a vote already exists (user voted on spot)
}
// 