package com.tracker.expensenest.model;

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
public class Category {

    @Id
    @UuidGenerator
    @GeneratedValue(strategy = GenerationType.UUID)

    private UUID id;
    private UUID customer_id;
    private String category_name;
    private String category_description;

    @Enumerated(EnumType.STRING)
    private Category_type Category_type;

    public enum Category_type {
        INCOME,
        EXPENSE
    }


    
}
