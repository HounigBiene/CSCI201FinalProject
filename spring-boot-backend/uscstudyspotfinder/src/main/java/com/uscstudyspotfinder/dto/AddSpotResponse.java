package com.uscstudyspotfinder.dto;

public class AddSpotResponse {
    private Long locationId;
    private String name;
    private String description;
    private double latitude;
    private double longitude;
    private Integer currentCheckInCount;

    public AddSpotResponse() {
    }

    public AddSpotResponse(Long locationId, String name, String description, double latitude, double longitude, Integer currentCheckInCount) {
        this.locationId = locationId;
        this.name = name;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.currentCheckInCount = currentCheckInCount;
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

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public Integer getCurrentCheckInCount() {
        return currentCheckInCount;
    }

    public void setCurrentCheckInCount(Integer currentCheckInCount) {
        this.currentCheckInCount = currentCheckInCount;
    }
} 