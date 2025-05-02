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
    public ResponseEntity<String> checkInUser(@PathVariable Long locationId, @PathVariable Integer userId) {
        StudySpot studySpot = studySpotRepository.findById(locationId)
            .orElseThrow(() -> new RuntimeException("StudySpot not found."));

        CheckIn checkIn = new CheckIn(userId, LocalDateTime.now(), studySpot, null);
        checkInRepository.save(checkIn);

        // increment people count
        Integer currentCount = studySpot.getCurrentCheckInCount();
        studySpot.setCurrentCheckInCount((currentCount != null ? currentCount : 0) + 1);
        studySpotRepository.save(studySpot);

        return ResponseEntity.ok("User checked in successfully.");
    }

    @GetMapping("/{locationId}/total")
    public ResponseEntity<Integer> getTotalCheckedIn(@PathVariable Long locationId) {
        StudySpot studySpot = studySpotRepository.findById(locationId)
            .orElseThrow(() -> new RuntimeException("StudySpot not found."));
        return ResponseEntity.ok(studySpot.getCurrentCheckInCount());
    }

    @PostMapping("/{locationId}/user/{userId}/checkout")
    public ResponseEntity<?> checkOut(@PathVariable Long locationId, @PathVariable Integer userId) {
        // TODO: Fix the checkout time handling logic; Ensure that only one active check-in exists for a user per location
        CheckIn checkIn = checkInRepository.findActiveCheckIn(userId, locationId);
        if (checkIn == null) {
            return ResponseEntity.badRequest().body("No active check-in found.");
        }
        //delete checkout time
        checkInRepository.delete(checkIn);

        // decrease check-in count
        StudySpot studySpot = checkIn.getStudySpot();
        studySpot.setCurrentCheckInCount(studySpot.getCurrentCheckInCount() - 1);
        studySpotRepository.save(studySpot);

        return ResponseEntity.ok("User checked out successfully.");
    }
}
//