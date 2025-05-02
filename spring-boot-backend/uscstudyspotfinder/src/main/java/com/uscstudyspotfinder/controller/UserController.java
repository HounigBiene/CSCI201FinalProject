package com.uscstudyspotfinder.controller;

import com.uscstudyspotfinder.model.User;
import com.uscstudyspotfinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{userId}/add-friend/{friendId}")
    public String addFriend(@PathVariable Long userId, @PathVariable Long friendId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<User> friendOpt = userRepository.findById(friendId);

        if (userOpt.isPresent() && friendOpt.isPresent()) {
            User user = userOpt.get();
            User friend = friendOpt.get();
            user.addFriend(friend);
            userRepository.save(user);
            return "Friend added successfully!";
        } else {
            return "User or friend not found.";
        }
    }

    @PostMapping("/search")
    public ResponseEntity<List<User>> searchUsersByEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        List<User> matches = userRepository.findUsersByEmail(email);
        if (matches.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }

        return ResponseEntity.ok(matches);
    }
}
