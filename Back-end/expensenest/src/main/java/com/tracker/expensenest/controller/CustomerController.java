package com.tracker.expensenest.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tracker.expensenest.model.Customer;
import com.tracker.expensenest.service.CustomerService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    public List<Customer> getAllCustomer(Customer customer) {
        return customerService.getAllCustomer();
    }
    
    @PostMapping("/updateCustomer/{id}")
    public Customer saveCustomer(@RequestBody @NonNull Customer customer) {
        
        return customerService.saveCustomer(customer);
    
    }

    @DeleteMapping("/{id}")
    public String deleteCustomer(@PathVariable UUID id) {

        return "Customer delete: " + id;

    }

}
