package com.uscstudyspotfinder.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public class CheckInId implements Serializable {

    private Integer userId;
    private Long studySpot;

    // Default constructor
    public CheckInId() {}

    // Constructor with fields
    public CheckInId(Integer userId, Long studySpot) {
        this.userId = userId;
        this.studySpot = studySpot;
    }

    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Long getStudySpot() {
        return studySpot;
    }

    public void setStudySpot(Long studySpot) {
        this.studySpot = studySpot;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CheckInId)) return false;
        CheckInId that = (CheckInId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(studySpot, that.studySpot);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, studySpot);
    }
}

//