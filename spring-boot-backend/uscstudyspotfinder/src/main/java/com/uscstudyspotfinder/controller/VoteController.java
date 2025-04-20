package com.uscstudyspotfinder.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        if (userOpt.isPresent() && studyOpt.isPresent())
        {
            voteRepository.addVote(userId, spotId);
            return "Successfully added vote";
        }
        else
        {
            return "User or spot not found.";
        }

    }

}
