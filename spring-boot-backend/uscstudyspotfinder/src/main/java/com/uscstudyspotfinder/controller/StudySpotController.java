package com.uscstudyspotfinder.controller;

import com.uscstudyspotfinder.dto.StudySpotResponse;
import com.uscstudyspotfinder.model.StudySpot;
import com.uscstudyspotfinder.repository.StudySpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/studyspots")
@CrossOrigin
public class StudySpotController {

    @Autowired
    private StudySpotRepository studySpotRepository;

    @GetMapping
    public ResponseEntity<List<StudySpotResponse>> getAllStudySpots() {
        List<StudySpot> spots = studySpotRepository.findAll();
        
        List<StudySpotResponse> spotDtos = spots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(spotDtos);
    }

    private StudySpotResponse convertToDto(StudySpot spot) {
        StudySpotResponse dto = new StudySpotResponse();
        dto.setLocationId(spot.getLocationId());
        dto.setName(spot.getName());
        dto.setDescription(spot.getDescription());
        
        if (spot.getLocationPin() != null) {
            dto.setLatitude(spot.getLocationPin().getY());
            dto.setLongitude(spot.getLocationPin().getX());
        } else {
            dto.setLatitude(0.0);
            dto.setLongitude(0.0);        
        }

        return dto;
    }

}