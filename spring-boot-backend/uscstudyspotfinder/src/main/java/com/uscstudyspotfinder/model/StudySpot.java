package com.uscstudyspotfinder.model;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "study_spot")
public class StudySpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    @Lob
    private String description;

    @Column(name = "location_pin", nullable = false)
    private Point locationPin;

    @Column(name = "current_check_in_count", nullable = false)
    private Integer currentCheckInCount = 0;

    public StudySpot() {
    }

    public StudySpot(String name, String description, Point locationPin) {
        this.name = name;
        this.description = description;
        this.locationPin = locationPin;
        this.currentCheckInCount = 0;
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Point getLocationPin() {
        return locationPin;
    }

    public void setLocationPin(Point locationPin) {
        this.locationPin = locationPin;
    }

    public Integer getCurrentCheckInCount() {
        return currentCheckInCount;
    }

    public void setCurrentCheckInCount(Integer currentCheckInCount) {
        this.currentCheckInCount = currentCheckInCount;
    }
}
