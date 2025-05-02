package com.uscstudyspotfinder.model;

import jakarta.persistence.*;

@Entity
@IdClass(FavSpotId.class)
@Table(name = "fave_spot")
public class FavSpot {

    @Id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Id
    @Column(name = "location_id", nullable = false)
    private Long spotId;

    public FavSpot() {}

    public FavSpot(Long userId, Long spotId) {
        this.userId = userId;
        this.spotId = spotId;
    }

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
        return "FavSpot{" +
                "userId=" + userId +
                ", spotId=" + spotId +
                '}';
    }
}
