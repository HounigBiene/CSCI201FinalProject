package com.uscstudyspotfinder.controller;

import com.uscstudyspotfinder.model.User;
import com.uscstudyspotfinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
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
}
