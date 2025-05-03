package com.uscstudyspotfinder.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.uscstudyspotfinder.repository.UserRepository;
import com.uscstudyspotfinder.repository.StudySpotRepository;
import com.uscstudyspotfinder.repository.VoteRepository;
import com.uscstudyspotfinder.model.Vote;
import com.uscstudyspotfinder.model.VoteId;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vote")
public class VoteController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudySpotRepository spotRepository;

    @Autowired
    private VoteRepository voteRepository;

    @PostMapping("/upvote")
    public ResponseEntity<String> upvote(@RequestBody VoteRequest request) {
        return handleVote(request.getUserId(), request.getSpotId(), "upvote");
    }

    @PostMapping("/downvote")
    public ResponseEntity<String> downvote(@RequestBody VoteRequest request) {
        return handleVote(request.getUserId(), request.getSpotId(), "downvote");
    }

    private ResponseEntity<String> handleVote(Long userId, Long spotId, String voteType) {
        try {
            // Check if user and spot exist
            if (!userRepository.existsById(userId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            if (!spotRepository.existsById(spotId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Study spot not found");
            }

            VoteId voteId = new VoteId(userId, spotId);
            Optional<Vote> existingVote = voteRepository.findById(voteId);

            if (existingVote.isPresent()) {
                // Update existing vote
                Vote vote = existingVote.get();
                if (voteType.equals(vote.getVoteType())) {
                    // Same vote type - remove the vote
                    voteRepository.delete(vote);
                    return ResponseEntity.ok("Vote removed");
                } else {
                    // Different vote type - update it
                    vote.setVoteType(voteType);
                    voteRepository.save(vote);
                    return ResponseEntity.ok("Vote updated");
                }
            } else {
                // Create new vote
                Vote newVote = new Vote(userId, spotId);
                newVote.setVoteType(voteType);
                voteRepository.save(newVote);
                return ResponseEntity.ok("Vote recorded");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing vote: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserVoteResponse>> getUserVotes(@PathVariable Long userId) {
        try {
            List<Vote> votes = voteRepository.findByUserId(userId);
            List<UserVoteResponse> response = votes.stream()
                .map(vote -> new UserVoteResponse(vote.getId().getSpotId(), vote.getVoteType()))
                .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper classes for request/response
    static class VoteRequest {
        private Long userId;
        private Long spotId;

        // Getters and setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getSpotId() { return spotId; }
        public void setSpotId(Long spotId) { this.spotId = spotId; }
    }

    static class UserVoteResponse {
        private Long spotId;
        private String voteType;

        public UserVoteResponse(Long spotId, String voteType) {
            this.spotId = spotId;
            this.voteType = voteType;
        }

        // Getters
        public Long getSpotId() { return spotId; }
        public String getVoteType() { return voteType; }
    }
}