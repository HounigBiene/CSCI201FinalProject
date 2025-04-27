package com.uscstudyspotfinder.model;

import jakarta.persistence.*;

@Entity
@IdClass(FavSpotId.class)
@Table(name = "fave_spot")
public class FavSpot {

    @Id
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "location_id", nullable = false)
    private Integer locId;

    // Default constructor
    public FavSpot() {
    }

    // Parameterized constructor
    public FavSpot(Integer userId, Integer locId) {
        this.userId = userId;
        this.locId = locId;
    }

    // Getters and setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getSpotId() {
        return locId;
    }

    public void setSpotId(Integer locId) {
        this.locId = locId;
    }

    @Override
    public String toString() {
        return "FavSpot{" +
                "userId=" + userId +
                ", locId=" + locId +
                '}';
    }
}
