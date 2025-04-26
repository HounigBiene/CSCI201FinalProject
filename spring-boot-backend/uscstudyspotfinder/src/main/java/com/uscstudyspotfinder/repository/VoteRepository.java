package com.uscstudyspotfinder.repository;

import com.uscstudyspotfinder.model.StudySpot;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<StudySpot, Long> {

    void addVote(Long userId, Long spotId);

}
