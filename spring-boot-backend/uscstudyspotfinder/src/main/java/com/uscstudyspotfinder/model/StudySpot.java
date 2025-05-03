package com.uscstudyspotfinder.model;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.GeometryFactory;
import com.fasterxml.jackson.annotation.JsonProperty;


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

    @Transient
    @JsonProperty("latitude")
    private double latitude;

    @Transient
    @JsonProperty("longitude")
    private double longitude;

    public StudySpot() {
    }

    public StudySpot(String name, String description, double latitude, double longitude) {
        this.name = name;
        this.description = description;
        this.currentCheckInCount = 0;

        GeometryFactory geometryFactory = new GeometryFactory();

        System.out.println("in constructor");
        System.out.println(longitude);
        System.out.println(latitude);
        this.locationPin = geometryFactory.createPoint(new Coordinate(longitude, latitude)); 
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
        System.out.println("Waaaaaaaghhh");
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

    @JsonProperty("latitude")
    public void setLatitude(double latitude) {
        System.out.println("Lat: " + latitude);
        this.latitude = latitude;
    }

    @JsonProperty("longitude")
    public void setLongitude(double longitude) {
        System.out.println("Lng: " + longitude);
        this.longitude = longitude;
    }

    @JsonProperty("latitude")
    public double getLatitude() {
        return this.latitude;
    }

    @JsonProperty("longitude")
    public double getLongitude() {
        return this.longitude;
    }
}
