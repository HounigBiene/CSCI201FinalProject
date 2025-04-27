package com.uscstudyspotfinder.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import com.uscstudyspotfinder.repository.UserRepository;
import com.uscstudyspotfinder.repository.StudySpotRepository;
import com.uscstudyspotfinder.model.StudySpot;
import com.uscstudyspotfinder.repository.VoteRepository;
import com.uscstudyspotfinder.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Optional;

@RestController
public class VoteController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudySpotRepository spotRepository;

    @Autowired
    private VoteRepository voteRepository;

    @PostMapping("{userId}/vote/{spotId}")
    public ResponseEntity<String> vote(@PathVariable Long userId, @PathVariable Long spotId )
    {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<StudySpot> spotOpt = spotRepository.findById(spotId);

        if (userOpt.isPresent() && spotOpt.isPresent())
        {
            return ResponseEntity.ok("Successfully added vote");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or spot not found.");
        }
    }

}
