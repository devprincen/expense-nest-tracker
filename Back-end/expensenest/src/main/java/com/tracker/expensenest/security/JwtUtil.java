package com.tracker.expensenest.security;

import java.security.Key;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    
    private final String SECRET = "mySecretKeyForJwtAuthenticationExpenseNest12345679";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

   public String GenerateTolen(String email) {

    return Jwts
   }
}
