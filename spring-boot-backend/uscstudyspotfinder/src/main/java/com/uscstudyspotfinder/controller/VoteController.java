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
import java.util.Map;
import java.util.HashMap;

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

    private ResponseEntity<String> handleVote(Integer userId, Integer spotId, String voteType) {
        try {            
            VoteId voteId = new VoteId(userId, spotId);
            Optional<Vote> existingVote = voteRepository.findById(voteId);

            if (existingVote.isPresent()) {
                Vote vote = existingVote.get();
                if (voteType.equals(vote.getVoteType())) {
                    voteRepository.delete(vote);
                    return ResponseEntity.ok("Vote removed");
                } else {
                    vote.setVoteType(voteType);
                    voteRepository.save(vote);
                    return ResponseEntity.ok("Vote updated");
                }
            } else {
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
    public ResponseEntity<List<UserVoteResponse>> getUserVotes(@PathVariable Integer userId) {
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

    @GetMapping("/upvotes/{spotId}")
    public ResponseEntity<Integer> getUpvotes(@PathVariable Integer spotId) {
        try {
            long count = voteRepository.countBySpotIdAndVoteType(spotId, "upvote");
            return ResponseEntity.ok((int) count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/downvotes/{spotId}")
    public ResponseEntity<Integer> getDownvotes(@PathVariable Integer spotId) {
        try {
            long count = voteRepository.countBySpotIdAndVoteType(spotId, "downvote");
            return ResponseEntity.ok((int) count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}/spot/{spotId}")
    public ResponseEntity<Map<String, String>> getUserVoteForSpot(
            @PathVariable Integer userId,
            @PathVariable Integer spotId) {
        try {
            String voteType = voteRepository.findVoteTypeByUserAndSpot(userId, spotId);
            Map<String, String> response = new HashMap<>();
            response.put("voteType", voteType != null ? voteType : "");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    static class VoteRequest {
        private Integer userId;
        private Integer spotId;

        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        public Integer getSpotId() { return spotId; }
        public void setSpotId(Integer spotId) { this.spotId = spotId; }
    }

    static class UserVoteResponse {
        private Integer spotId;
        private String voteType;

        public UserVoteResponse(Integer spotId, String voteType) {
            this.spotId = spotId;
            this.voteType = voteType;
        }

        public Integer getSpotId() { return spotId; }
        public String getVoteType() { return voteType; }
    }
}
