package com.tracker.expensenest.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tracker.expensenest.model.Category;

public interface CategoryRepo extends JpaRepository<Category, UUID> {

}


