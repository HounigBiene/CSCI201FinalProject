package com.uscstudyspotfinder.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "friends_list")
@IdClass(FriendListId.class)
public class FriendList implements Serializable {

    @Id
    @Column(name = "user_id_1")
    private Integer userId1;

    @Id
    @Column(name = "user_id_2")
    private Integer userId2;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FriendStatus status;

    public enum FriendStatus {
        pending, accepted, declined
    }

    // Default constructor
    public FriendList() {
    }

    // Constructor with fields
    public FriendList(Integer userId1, Integer userId2, FriendStatus status) {
        this.userId1 = userId1;
        this.userId2 = userId2;
        this.status = status;
    }

    // Getters and Setters
    public Integer getUserId1() {
        return userId1;
    }

    public void setUserId1(Integer userId1) {
        this.userId1 = userId1;
    }

    public Integer getUserId2() {
        return userId2;
    }

    public void setUserId2(Integer userId2) {
        this.userId2 = userId2;
    }

    public FriendStatus getStatus() {
        return status;
    }

    public void setStatus(FriendStatus status) {
        this.status = status;
    }
}
