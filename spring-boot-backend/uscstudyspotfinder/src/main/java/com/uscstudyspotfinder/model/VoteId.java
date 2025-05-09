package com.uscstudyspotfinder.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class VoteId implements Serializable {

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "location_id")
    private Integer spotId;

    public VoteId() {
    }

    public VoteId(Integer userId, Integer spotId) {
        this.userId = userId;
        this.spotId = spotId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getSpotId() {
        return spotId;
    }

    public void setSpotId(Integer spotId) {
        this.spotId = spotId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof VoteId)) return false;
        VoteId that = (VoteId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(spotId, that.spotId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, spotId);
    }
}
