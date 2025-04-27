package com.uscstudyspotfinder.model;

import jakarta.persistence.*;

@Entity
@Table(name = "votes")
public class Vote {

    @EmbeddedId
    private VoteId id;

    public Vote() {
    }

    public Vote(Long userId, Long spotId) {
        this.id = new VoteId(userId, spotId);
    }

    public VoteId getId() {
        return id;
    }

    public void setId(VoteId id) {
        this.id = id;
    }

    public Long getUserId() {
        return id.getUserId();
    }

    public Long getSpotId() {
        return id.getSpotId();
    }

    @Override
    public String toString() {
        return "Vote{" +
                "userId=" + id.getUserId() +
                ", spotId=" + id.getSpotId() +
                '}';
    }
}
