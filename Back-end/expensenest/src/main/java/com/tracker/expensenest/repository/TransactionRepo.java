package com.tracker.expensenest.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tracker.expensenest.model.Transaction;

public interface TransactionRepo extends JpaRepository<Transaction, UUID>{

    List<Transaction> findByCustomerId(UUID customerId);

}
