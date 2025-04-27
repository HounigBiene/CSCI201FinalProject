package com.uscstudyspotfinder.dto;

public class FavoriteRequest {
    private Long userId;
    private Long spotId;

    // Default constructor
    public FavoriteRequest() {
    }

    // Parameterized constructor
    public FavoriteRequest(Long userId, Long spotId) {
        this.userId = userId;
        this.spotId = spotId;
    }

    // Getters and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSpotId() {
        return spotId;
    }

    public void setSpotId(Long spotId) {
        this.spotId = spotId;
    }

    @Override
    public String toString() {
        return "FavoriteRequest{" +
                "userId=" + userId +
                ", spotId=" + spotId +
                '}';
    }
}
