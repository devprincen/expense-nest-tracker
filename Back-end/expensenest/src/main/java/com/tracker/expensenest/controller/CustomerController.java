package com.tracker.expensenest.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.tracker.expensenest.model.Customer;
import com.tracker.expensenest.service.CustomerService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@CrossOrigin("/api/customer")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }
    
    @GetMapping
    public List<Customer> getAllCustomer(@RequestParam Customer customer) {
        return customerService.getAllCustomer(customer);
    }

    @PostMapping
    public Customer saveCustomer(@RequestBody Customer customer) {
        
        return customerService.save(customer);
    }
    
    

}
