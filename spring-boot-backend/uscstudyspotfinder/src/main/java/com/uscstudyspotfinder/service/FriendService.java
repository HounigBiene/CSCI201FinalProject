package com.uscstudyspotfinder.service;

import com.uscstudyspotfinder.model.CheckIn;
import com.uscstudyspotfinder.model.FriendList;
import com.uscstudyspotfinder.model.FriendListId;
import com.uscstudyspotfinder.model.User;
import com.uscstudyspotfinder.repository.CheckInRepository;
import com.uscstudyspotfinder.repository.FriendListRepository;
import com.uscstudyspotfinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public void sendFriendRequest(String senderUsername, String receiverUsername) {
    User sender = userRepository.findByUsername(senderUsername)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));

    User receiver = userRepository.findByUsername(receiverUsername)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receiver not found"));

    // Prevent duplicate friend requests
    FriendListId friendListId = new FriendListId(sender.getUserId().intValue(), receiver.getUserId().intValue());
    if (friendListRepository.existsById(friendListId)) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Friend request already exists");
    }

    FriendList friendRequest = new FriendList();
    friendRequest.setUserId1(sender.getUserId().intValue());
    friendRequest.setUserId2(receiver.getUserId().intValue());
    friendRequest.setStatus(FriendList.FriendStatus.pending);

    friendListRepository.save(friendRequest);
}

public void acceptFriendRequest(String senderUsername, String receiverUsername) {
    User sender = userRepository.findByUsername(senderUsername)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));
    User receiver = userRepository.findByUsername(receiverUsername)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receiver not found"));

    FriendListId friendListId = new FriendListId(sender.getUserId().intValue(), receiver.getUserId().intValue());

    FriendList friendRequest = friendListRepository.findById(friendListId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Friend request not found"));

    if (friendRequest.getStatus() != FriendList.FriendStatus.pending) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Friend request is not pending");
    }

    friendRequest.setStatus(FriendList.FriendStatus.accepted);
    friendListRepository.save(friendRequest);
}

public void declineFriendRequest(String senderUsername, String receiverUsername) {
    User sender = userRepository.findByUsername(senderUsername)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));
    User receiver = userRepository.findByUsername(receiverUsername)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receiver not found"));

    FriendListId friendListId = new FriendListId(sender.getUserId().intValue(), receiver.getUserId().intValue());

    FriendList friendRequest = friendListRepository.findById(friendListId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Friend request not found"));

    if (friendRequest.getStatus() != FriendList.FriendStatus.pending) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Friend request is not pending");
    }

    friendRequest.setStatus(FriendList.FriendStatus.declined);
    friendListRepository.save(friendRequest);
}
    public List<Map<String, Object>> getPendingRequests(String username) {
        User receiver = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<FriendList> pendingRequests = friendListRepository.findByUserId2AndStatus(
                receiver.getUserId(), FriendList.FriendStatus.pending);

        List<Map<String, Object>> response = new ArrayList<>();

        for (FriendList request : pendingRequests) {
            User sender = userRepository.findById(request.getUserId1().longValue())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));

            Map<String, Object> requestData = new HashMap<>();
            requestData.put("senderUsername", sender.getUsername());
            requestData.put("senderUserId", sender.getUserId());
            requestData.put("status", request.getStatus().toString());

            response.add(requestData);
        }

        return response;
    }
    public List<Map<String, Object>> getFriendsList(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FriendList> friendshipsInitiatedByUser = friendListRepository.findByUserId1AndStatus(
                user.getUserId(), FriendList.FriendStatus.accepted);

        List<FriendList> friendshipsReceivedByUser = friendListRepository.findByUserId2AndStatus(
                user.getUserId(), FriendList.FriendStatus.accepted);

        List<Map<String, Object>> friends = new ArrayList<>();

        // Friends where current user is userId1
        for (FriendList friendship : friendshipsInitiatedByUser) {
            Integer friendId = friendship.getUserId2();
            User friend = userRepository.findById(friendId.longValue())
                    .orElseThrow(() -> new RuntimeException("Friend not found"));

            Map<String, Object> friendData = new HashMap<>();
            friendData.put("userId", friend.getUserId());
            friendData.put("username", friend.getUsername());
            friendData.put("email", friend.getEmail());

            friends.add(friendData);
        }

        // Friends where current user is userId2
        for (FriendList friendship : friendshipsReceivedByUser) {
            Integer friendId = friendship.getUserId1();
            User friend = userRepository.findById(friendId.longValue())
                    .orElseThrow(() -> new RuntimeException("Friend not found"));

            Map<String, Object> friendData = new HashMap<>();
            friendData.put("userId", friend.getUserId());
            friendData.put("username", friend.getUsername());
            friendData.put("email", friend.getEmail());

            friends.add(friendData);
        }

        return friends;
    }
}
