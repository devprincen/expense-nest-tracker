package com.tracker.expensenest.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tracker.expensenest.model.Transaction;
import com.tracker.expensenest.service.TransactionService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/transaction")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }
    
    @GetMapping
    public List<Transaction> getAllTransaction(@RequestParam(required = false) UUID customerId) {

        if(customerId != null) {
            return transactionService.getAllTransactionByCustomerId(customerId);
        }

        return transactionService.getAllTransaction();
    }

    @PostMapping
    public Transaction addTransaction(@RequestBody Transaction transaction) {
        
        return transactionService.addTransaction(transaction);
    }

    @PutMapping("/{id}")
    public Transaction updateTransaction(@PathVariable UUID id, @RequestBody Transaction transaction) {
        
        return transactionService.updateTransaction(id, transaction);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(@PathVariable UUID id) {
        transactionService.deleteTransaction(id);

        return ResponseEntity.ok("Transaction delete: " + id);
    }
    
}
