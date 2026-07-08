package com.tracker.expensenest.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tracker.expensenest.Request.AuthResponse;
import com.tracker.expensenest.Request.LoginRequest;
import com.tracker.expensenest.Request.RegisterRequest;
import com.tracker.expensenest.model.Customer;
import com.tracker.expensenest.repository.CustomerRepo;
import com.tracker.expensenest.security.JwtUtil;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final CustomerRepo customerRepo;
    private final JwtUtil jwtUtil;

    public String register(RegisterRequest request){

        if (customerRepo.findByEmail(request.getPassword()).isPresent()) {
            throw new RuntimeException("Email already exist: ");
        }
            Customer customer = Customer.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword())).build();

        customerRepo.save(customer);
        
        return "Customer Registered Successfully: ";
    }
    
    public AuthResponse login(LoginRequest request) {

        Customer customer = customerRepo.findByEmail(request.getEmail()).orElseThrow();

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid Password: ");
        }

        String token = jwtUtil.generateToken(customer.getEmail());
        return new AuthResponse(token, customer);
    
    }
}
