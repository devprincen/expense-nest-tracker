package com.tracker.expensenest.service;

import java.util.List;
import java.util.UUID;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.tracker.expensenest.model.Customer;
import com.tracker.expensenest.repository.CustomerRepo;

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

    public Customer updateCustomer(UUID id, Customer customer) {

        Customer old = customerRepo.findById(id).orElseThrow();
        old.setBudget(customer.getBudget());
        old.setPassword(customer.getPassword());

        return customerRepo.save(old);
    }

    public void deleteCustomer(String id) {
        customerRepo.deleteById(UUID.fromString(id));
    }
}
