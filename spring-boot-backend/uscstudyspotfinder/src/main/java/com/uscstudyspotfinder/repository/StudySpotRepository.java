package com.uscstudyspotfinder.repository;

import com.uscstudyspotfinder.model.StudySpot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudySpotRepository extends JpaRepository<StudySpot, Long> {
}
