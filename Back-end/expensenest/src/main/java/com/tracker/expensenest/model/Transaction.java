package com.tracker.expensenest.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @UuidGenerator
    @GeneratedValue(strategy = GenerationType.UUID)

    private UUID id;
    private UUID customerId;
    private UUID categoryId;
    private double amount;
    private String comment;
    private LocalDateTime date;
    
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    public enum TransactionType {
        CREDIT,
        DEBIT
    }
}
