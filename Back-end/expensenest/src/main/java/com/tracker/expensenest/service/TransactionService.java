package com.tracker.expensenest.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.tracker.expensenest.model.Transaction;
import com.tracker.expensenest.repository.TransactionRepo;

@Service
public class TransactionService {

    private final TransactionRepo transactionRepo;

    public TransactionService(TransactionRepo transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    public List<Transaction> getAllTransaction() {
        return transactionRepo.findAll();
    }
    
    public List<Transaction> getAllTransactionByCustomerId(UUID customerId) {
        return transactionRepo.findByCustomerId(customerId);
    }

    public Transaction addTransaction(Transaction transaction) {
        if(transaction.getDate() == null) {
                transaction.setDate(LocalDateTime.now());
        }

        return transactionRepo.save(transaction);
    }

    public Transaction updateTransaction(UUID id, Transaction transaction) {

        Transaction old = transactionRepo.findById(id).orElseThrow();

        old.setCategoryId(transaction.getCategoryId());
        old.setAmount(transaction.getAmount());
        old.setComment(transaction.getComment());
        old.setDate(transaction.getDate() != null ? transaction.getDate() : old.getDate());
        old.setTransactionType(transaction.getTransactionType());

        return transactionRepo.save(old);
    }

    public void deleteTransaction(UUID id) {

        transactionRepo.deleteById(id);
    }
}
