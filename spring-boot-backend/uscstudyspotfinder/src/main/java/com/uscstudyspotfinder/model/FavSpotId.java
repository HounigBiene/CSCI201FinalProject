package com.uscstudyspotfinder.model;

import java.io.Serializable;
import java.util.Objects;

public class FavSpotId implements Serializable {

    private Long userId;
    private Long spotId;  // <-- FIX: must match FavSpot.java field name exactly

    public FavSpotId() {}

    public FavSpotId(Long userId, Long spotId) {
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
        if (!(o instanceof FavSpotId)) return false;
        FavSpotId that = (FavSpotId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(spotId, that.spotId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, spotId);
    }
}
