package com.tracker.expensenest.controller;

import org.springframework.web.bind.annotation.RestController;

import com.tracker.expensenest.Request.LoginRequest;
import com.tracker.expensenest.Request.RegisterRequest;
import com.tracker.expensenest.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@CrossOrigin("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        
        return ResponseEntity.ok(authService.register(request));
    }


    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        
        return ResponseEntity.ok(authService.login(request));
    }
    
    
    
}
