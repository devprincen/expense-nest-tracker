package com.tracker.expensenest.model;

import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "customers")
public class Customer {
    
    @Id
    @UuidGenerator
    @GeneratedValue(strategy = GeneratedValue.UUID)

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private double budget;
    private double income;

    @Enumerated(EnumType.STRING)
    private Status Status;

    public enum Status {
        ACTIVE,
        DEACTIVATE
    }



}
