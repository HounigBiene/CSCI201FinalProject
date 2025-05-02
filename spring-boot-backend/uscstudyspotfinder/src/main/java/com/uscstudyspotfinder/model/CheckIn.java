package com.uscstudyspotfinder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_in")
@IdClass(CheckInId.class)
public class CheckIn {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Id
    @ManyToOne
    @JoinColumn(name = "location_id", referencedColumnName = "location_id", nullable = false)
    private StudySpot studySpot;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    // Constructors
    public CheckIn() {
    }

    public CheckIn(Integer userId, LocalDateTime checkInTime, StudySpot studySpot, LocalDateTime checkOutTime) {
        this.userId = userId;
        this.checkInTime = checkInTime;
        this.studySpot = studySpot;
        this.checkOutTime = checkOutTime;
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

    public StudySpot getStudySpot() {
        return studySpot;
    }

    public void setStudySpot(StudySpot studySpot) {
        this.studySpot = studySpot;
    }

    public LocalDateTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalDateTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }
}

//