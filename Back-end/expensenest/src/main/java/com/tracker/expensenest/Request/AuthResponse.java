package com.tracker.expensenest.Request;

import com.tracker.expensenest.model.Customer;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    
    private Customer customer;
    
}
