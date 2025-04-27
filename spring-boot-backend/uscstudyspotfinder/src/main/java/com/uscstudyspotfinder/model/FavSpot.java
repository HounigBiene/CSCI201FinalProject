package com.uscstudyspotfinder.model;

import jakarta.persistence.*;

@Entity
@Table(name = "favorite_spots")
public class FavSpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long spotId;

    // Default constructor
    public FavSpot() {
    }

    // Parameterized constructor
    public FavSpot(Long userId, Long spotId) {
        this.userId = userId;
        this.spotId = spotId;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
                "id=" + id +
                ", userId=" + userId +
                ", spotId=" + spotId +
                '}';
    }
}
