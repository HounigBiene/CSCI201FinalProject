package com.uscstudyspotfinder.repository;

import com.uscstudyspotfinder.model.CheckIn;
import com.uscstudyspotfinder.model.CheckInId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, CheckInId> {

    List<CheckIn> findByUserId(Integer userId);

    @Query("SELECT COUNT(c) FROM CheckIn c WHERE c.studySpot.id = :locationId AND c.checkOutTime IS NULL")
    Integer countCurrentCheckIns(@Param("locationId") Long locationId);

    @Query("SELECT c FROM CheckIn c WHERE c.userId = :userId AND c.studySpot.id = :locationId AND c.checkOutTime IS NULL")
    CheckIn findActiveCheckIn(@Param("userId") Integer userId, @Param("locationId") Long locationId);
}
