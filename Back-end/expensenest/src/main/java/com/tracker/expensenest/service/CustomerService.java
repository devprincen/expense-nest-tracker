package com.tracker.expensenest.service;

import com.tracker.expensenest.repository.CustomerRepo;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tracker.expensenest.model.Customer;

@Service
public class CustomerService {
    
    private final CustomerRepo customerRepo;

    CustomerService(CustomerRepo customerRepo) {
        this.customerRepo = customerRepo;
    }

    public List<Customer> getAllCustomer() {
        return customerRepo.findAll();
    }
}
