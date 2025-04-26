package com.uscstudyspotfinder.repository;

import com.uscstudyspotfinder.model.StudySpot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudySpotRepository extends JpaRepository<StudySpot, Long> {

    Optional<StudySpot> findById(Long id);
}
