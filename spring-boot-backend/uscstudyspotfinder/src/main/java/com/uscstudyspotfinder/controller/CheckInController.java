package com.uscstudyspotfinder.controller;

import com.uscstudyspotfinder.model.CheckIn;
import com.uscstudyspotfinder.model.StudySpot;
import com.uscstudyspotfinder.repository.CheckInRepository;
import com.uscstudyspotfinder.repository.StudySpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/checkin")
public class CheckInController {

    @Autowired
    private CheckInRepository checkInRepository;

    @Autowired
    private StudySpotRepository studySpotRepository;

    @PostMapping("/{locationId}/user/{userId}")
    public ResponseEntity<String> checkInUser(@PathVariable Integer locationId, @PathVariable Integer userId) {
        StudySpot studySpot = studySpotRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("StudySpot not found."));

        CheckIn checkIn = new CheckIn(userId, LocalDateTime.now(), studySpot, null);
        checkInRepository.save(checkIn);

        return ResponseEntity.ok("User checked in successfully.");
    }

    @GetMapping("/{locationId}/total")
    public ResponseEntity<Integer> getTotalCheckedIn(@PathVariable Integer locationId) {
        Integer totalCheckedIn = checkInRepository.countCurrentCheckIns(locationId);
        return ResponseEntity.ok(totalCheckedIn);
    }
}
