package com.uscstudyspotfinder.model;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Point; // Import the JTS Point type

@Entity
@Table(name = "study_spot") // Explicitly map to the 'study_spot' table
public class StudySpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    @Lob // Often used for TEXT/CLOB types, though sometimes optional
    private String description;

    @Column(name = "location_pin", nullable = false /*, columnDefinition="POINT"*/)
    private Point locationPin;

    public StudySpot() {
    }

    public StudySpot(String name, String description, Point locationPin) {
        this.name = name;
        this.description = description;
        this.locationPin = locationPin;
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
}