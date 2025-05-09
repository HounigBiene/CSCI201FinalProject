package com.uscstudyspotfinder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import com.uscstudyspotfinder.repository.StudySpotRepository;
import com.uscstudyspotfinder.model.StudySpot;
import com.uscstudyspotfinder.dto.AddSpotResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.GeometryFactory;

@RestController
@RequestMapping("/api/addspot")
@CrossOrigin
public class AddSpotController {
    @Autowired
    private StudySpotRepository spotRepository;
    
    @PostMapping()
    public ResponseEntity<AddSpotResponse> addSpot(@RequestBody StudySpot spotrequest) {
        GeometryFactory geometryFactory = new GeometryFactory();
        System.out.println(spotrequest.getLongitude());
        System.out.println(spotrequest.getLatitude());
        Point location = geometryFactory.createPoint(
            new Coordinate(spotrequest.getLongitude(), spotrequest.getLatitude())
        );

        spotrequest.setLocationPin(location);
        spotrequest.setCurrentCheckInCount(0);

        System.out.println("About to save spot");
        StudySpot savedSpot = spotRepository.save(spotrequest);
        
        AddSpotResponse response = new AddSpotResponse(
            savedSpot.getLocationId(),
            savedSpot.getName(),
            savedSpot.getDescription(),
            savedSpot.getLatitude(),
            savedSpot.getLongitude(),
            savedSpot.getCurrentCheckInCount()
        );
        
        return ResponseEntity.ok(response);
    }
}
