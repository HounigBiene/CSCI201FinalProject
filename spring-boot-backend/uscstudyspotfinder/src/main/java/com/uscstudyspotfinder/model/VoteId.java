package com.uscstudyspotfinder.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class VoteId implements Serializable {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "location_id")
    private Long spotId;

    public VoteId() {
    }

    public VoteId(Long userId, Long spotId) {
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
