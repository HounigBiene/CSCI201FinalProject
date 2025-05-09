package com.uscstudyspotfinder.model;

import jakarta.persistence.*;

@Entity
@Table(name = "votes")
public class Vote {
    
    @EmbeddedId
    private VoteId id;

    @Column(name = "vote_type", nullable = false)
    private String voteType; // "upvote" or "downvote"

    public Vote() {
    }

    public Vote(Integer userId, Integer spotId) {
        this.id = new VoteId(userId, spotId);
    }
    
    public VoteId getId() {
        return id;
    }

    public void setId(VoteId id) {
        this.id = id;
    }

    public String getVoteType() {
        return voteType;
    }

    public void setVoteType(String voteType) {
        this.voteType = voteType;
    }

    public Integer getUserId() {
        return id.getUserId();
    }

    public Integer getSpotId() {
        return id.getSpotId();
    }

    @Override
    public String toString() {
        return "Vote{" +
                "userId=" + id.getUserId() +
                ", spotId=" + id.getSpotId() +
                ", voteType='" + voteType + '\'' +
                '}';
    }
}
