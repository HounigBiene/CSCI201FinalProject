package com.uscstudyspotfinder.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public class CheckInId implements Serializable {

    private Integer userId;
    private LocalDateTime checkInTime;

    // Default constructor
    public CheckInId() {}

    // Constructor with fields
    public CheckInId(Integer userId, LocalDateTime checkInTime) {
        this.userId = userId;
        this.checkInTime = checkInTime;
    }

    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CheckInId)) return false;
        CheckInId that = (CheckInId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(checkInTime, that.checkInTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, checkInTime);
    }
}

//