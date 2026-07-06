package com.tracker.expensenest.service;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.tracker.expensenest.Request.LoginRequest;
import com.tracker.expensenest.Request.RegisterRequest;
import com.tracker.expensenest.model.Customer;
import com.tracker.expensenest.repository.CustomerRepo;


@Service
public class AuthService {

    private final CustomerRepo customerRepo;

    public AuthService(CustomerRepo customerRepo) {
        this.customerRepo = customerRepo;
    }

    public String register(RegisterRequest request){

        return CustomerRepo.save(customerRepo);
    }
    
    public String login(LoginRequest request) {

        return;
    
    }
}
