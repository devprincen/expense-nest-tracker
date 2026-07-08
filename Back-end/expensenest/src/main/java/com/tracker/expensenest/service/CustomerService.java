package com.tracker.expensenest.service;

import com.tracker.expensenest.repository.CustomerRepo;
import java.util.List;

import org.springframework.lang.NonNull;
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

    public Customer saveCustomer(@NonNull Customer customer) {

        return customerRepo.save(customer);
    }
}
