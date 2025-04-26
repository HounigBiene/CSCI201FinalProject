package com.uscstudyspotfinder.repository;


import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Long> {

    void addVote(Long userId, Long spotId);

}
