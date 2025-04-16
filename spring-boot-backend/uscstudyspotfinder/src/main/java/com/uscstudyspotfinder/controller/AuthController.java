package com.uscstudyspotfinder.controller;

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
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User signUpRequest) {        
        if (userRepository.findByUsername(signUpRequest.getUsername()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Username is already taken!");
        }
        
        if (signUpRequest.getEmail() != null && userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");
        }
        
        User user = new User();
        user.setUsername(signUpRequest.getUsername());        
        if (signUpRequest.getEmail() != null) {
             user.setEmail(signUpRequest.getEmail());
        }        
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));        

        try {            
            userRepository.save(user);            
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal registrtaion error");
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );            
            SecurityContextHolder.getContext().setAuthentication(authentication);
                        
            org.springframework.security.core.userdetails.UserDetails userDetails =
                (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();             
            return ResponseEntity.ok("User logged in successfully. Welcome " + userDetails.getUsername() + "!");
        } catch (AuthenticationException e) {            
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Invalid username or password");
        } catch (Exception e) {            
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: An internal error occurred during login.");
        }
    }

}
