package com.uscstudyspotfinder.controller;

import org.springframework.beans.factory.annotation.Autowired;

import com.uscstudyspotfinder.repository.UserRepository;
import com.uscstudyspotfinder.repository.StudySpotRepository;
import com.uscstudyspotfinder.model.StudySpot;
import com.uscstudyspotfinder.repository.VoteRepository;
import com.uscstudyspotfinder.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Optional;

import com.uscstudyspotfinder.model.User;
import com.uscstudyspotfinder.repository.UserRepository;
import com.uscstudyspotfinder.dto.LoginRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;



@RestController
@RequestMapping("/api/addspot")
@CrossOrigin
public class AddSpotController {
	@Autowired
    private StudySpotRepository spotRepository;
	
	@PostMapping()
    public ResponseEntity<String> addSpot(@RequestBody StudySpot spotrequest)
    {
		
		spotRepository.save(spotrequest);
		
		return null;
    }
}
