package com.uscstudyspotfinder.controller;

import com.uscstudyspotfinder.dto.FriendRequest;
import com.uscstudyspotfinder.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;

    @GetMapping("/checkins")
    public ResponseEntity<?> getFriendsCheckIns(@RequestParam String username) {
        return ResponseEntity.ok(friendService.getFriendsCheckIns(username));
    }

    @PostMapping("/request")
    public ResponseEntity<?> sendFriendRequest(@RequestBody FriendRequest request) {
    friendService.sendFriendRequest(request.getSenderUsername(), request.getReceiverUsername());
    return ResponseEntity.ok("Friend request sent!");
    }

    @PostMapping("/accept")
    public ResponseEntity<?> acceptFriendRequest(@RequestBody FriendRequest request) {
        System.out.println("Accepting friend request from " + request.getSenderUsername() + " to " + request.getReceiverUsername());
        friendService.acceptFriendRequest(request.getSenderUsername(), request.getReceiverUsername());
        return ResponseEntity.ok("Friend request accepted!");
    }

    @PostMapping("/decline")
    public ResponseEntity<?> declineFriendRequest(@RequestBody FriendRequest request) {
        friendService.declineFriendRequest(request.getSenderUsername(), request.getReceiverUsername());
        return ResponseEntity.ok("Friend request declined!");
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<?> getPendingRequests(@RequestParam String username) {
        return ResponseEntity.ok(friendService.getPendingRequests(username));
    }

    @GetMapping("/list")
    public ResponseEntity<?> getFriendsList(@RequestParam String username) {
        return ResponseEntity.ok(friendService.getFriendsList(username));
    }
}
