package com.uscstudyspotfinder.repository;

import com.uscstudyspotfinder.model.FriendList;
import com.uscstudyspotfinder.model.FriendListId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendListRepository extends JpaRepository<FriendList, FriendListId> {
    // Find all friends where user_id_1 = given user, and status is 'accepted'
    List<FriendList> findByUserId1AndStatus(Long userId1, FriendList.FriendStatus status);
}
