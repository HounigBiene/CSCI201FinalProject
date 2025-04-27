package com.uscstudyspotfinder.controller;

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
}
