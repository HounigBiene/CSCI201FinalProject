package com.uscstudyspotfinder.controller;

import com.uscstudyspotfinder.dto.FavoriteRequest;
import com.uscstudyspotfinder.model.FavSpot;
import com.uscstudyspotfinder.repository.FavSpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;


@CrossOrigin
@RestController
@RequestMapping("/api/favorites")
public class FavSpotController {

    @GetMapping
    public ResponseEntity<String> hello() {
    return ResponseEntity.ok("Favorites endpoint is working!");
    }

    @Autowired
    private FavSpotRepository favSpotRepository;

    // Add a favorite spot
    @PostMapping
    @Transactional
    public ResponseEntity<String> addFavorite(@RequestBody FavoriteRequest favoriteRequest) {
        if (favSpotRepository.existsByUserIdAndSpotId(favoriteRequest.getUserId(), favoriteRequest.getSpotId())) {
            return ResponseEntity.badRequest().body("Spot is already marked as favorite.");
        }
        FavSpot favSpot = new FavSpot(favoriteRequest.getUserId(), favoriteRequest.getSpotId());
        favSpotRepository.save(favSpot);
        return ResponseEntity.ok("Favorite spot added successfully.");
    }

    // Get all favorite spots for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<FavSpot>> getFavoritesByUser(@PathVariable Long userId) {
        List<FavSpot> favorites = favSpotRepository.findByUserId(userId);
        return ResponseEntity.ok(favorites);
    }

    // Remove a favorite spot
    @DeleteMapping
    @Transactional
    public ResponseEntity<String> removeFavorite(@RequestBody FavoriteRequest favoriteRequest) {
        if (!favSpotRepository.existsByUserIdAndSpotId(favoriteRequest.getUserId(), favoriteRequest.getSpotId())) {
            return ResponseEntity.badRequest().body("Favorite spot does not exist.");
        }
        favSpotRepository.deleteByUserIdAndSpotId(favoriteRequest.getUserId(), favoriteRequest.getSpotId());
        return ResponseEntity.ok("Favorite spot removed successfully.");
    }
}

//
