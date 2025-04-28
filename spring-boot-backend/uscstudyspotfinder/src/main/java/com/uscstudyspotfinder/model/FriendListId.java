package com.uscstudyspotfinder.model;

import java.io.Serializable;
import java.util.Objects;

public class FriendListId implements Serializable {

    private Integer userId1;
    private Integer userId2;

    // Default constructor 
    public FriendListId() {
    }

    // Constructor with fields
    public FriendListId(Integer userId1, Integer userId2) {
        this.userId1 = userId1;
        this.userId2 = userId2;
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

    // equals() and hashCode() are REQUIRED for composite keys
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FriendListId)) return false;
        FriendListId that = (FriendListId) o;
        return Objects.equals(userId1, that.userId1) &&
               Objects.equals(userId2, that.userId2);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId1, userId2);
    }
}
