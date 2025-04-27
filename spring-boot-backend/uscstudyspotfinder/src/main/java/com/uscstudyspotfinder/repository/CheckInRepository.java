package com.uscstudyspotfinder.repository;

import com.uscstudyspotfinder.model.CheckIn;
import com.uscstudyspotfinder.model.CheckInId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, CheckInId> {
    List<CheckIn> findByUserId(Integer userId);
}
