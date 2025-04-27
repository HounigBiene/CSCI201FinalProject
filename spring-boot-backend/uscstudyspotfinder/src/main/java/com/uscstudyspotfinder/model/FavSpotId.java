package com.uscstudyspotfinder.model;

import java.io.Serializable;
import java.util.Objects;

public class FavSpotId implements Serializable {
	//because we are using composite key (user and loc are primary)
	//use this to map to java
	
	private Integer userId;
	private Integer locId;
	
	//default constructor
	public FavSpotId() {}
	
	public FavSpotId(Integer userId, Integer locId) {
		this.userId = userId;
		this.locId = locId;
	}
	
	@Override 
	public boolean equals(Object o) {
		if(this == o) {
			return true;	
		}
		if(!(o instanceof FavSpotId)) {
			return false;
		}
		FavSpotId that = (FavSpotId) o; 
		return Objects.equals(userId, that.userId)&& Objects.equals(locId,  that.locId); 
	}
	
    @Override
    public int hashCode() {
        return Objects.hash(userId, locId);
    }
}
