package com.uscstudyspotfinder.service;

import com.uscstudyspotfinder.model.CheckIn;
import com.uscstudyspotfinder.model.FriendList;
import com.uscstudyspotfinder.model.User;
import com.uscstudyspotfinder.repository.CheckInRepository;
import com.uscstudyspotfinder.repository.FriendListRepository;
import com.uscstudyspotfinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FriendService {

    @Autowired
    private FriendListRepository friendListRepository;

    @Autowired
    private CheckInRepository checkInRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Map<String, Object>> getFriendsCheckIns(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FriendList> friendships = friendListRepository.findByUserId1AndStatus(user.getUserId(), FriendList.FriendStatus.accepted);

        List<Map<String, Object>> response = new ArrayList<>();

        for (FriendList friendship : friendships) {
            Integer friendId = friendship.getUserId2();
            User friend = userRepository.findById(friendId.longValue())
            .orElseThrow(() -> new RuntimeException("Friend not found"));

            List<CheckIn> checkIns = checkInRepository.findByUserId(friend.getUserId().intValue());

            // Find current check-in (no check-out yet)
            CheckIn currentCheckIn = checkIns.stream()
                    .filter(c -> c.getCheckOutTime() == null)
                    .findFirst()
                    .orElse(null);

            Map<String, Object> friendData = new HashMap<>();
            friendData.put("friendUsername", friend.getUsername());

            if (currentCheckIn != null) {
                friendData.put("studySpot", currentCheckIn.getStudySpot().getName());
            } else {
                friendData.put("studySpot", null);
            }

            response.add(friendData);
        }

        return response;
    }
}
