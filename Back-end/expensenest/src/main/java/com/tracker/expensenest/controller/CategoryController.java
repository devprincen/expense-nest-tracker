package com.tracker.expensenest.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tracker.expensenest.model.Category;
import com.tracker.expensenest.repository.CategoryRepo;
import com.tracker.expensenest.service.CategoryService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/category")
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryRepo categoryRepo;

    public CategoryController(CategoryService categoryService, CategoryRepo categoryRepo) {
        this.categoryService = categoryService;
        this.categoryRepo = categoryRepo;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    @PostMapping
    public Category saveCategories(@RequestBody Category category) {
        
        return categoryRepo.save(category);
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable UUID id, @RequestBody Category category) {
        
        return categoryService.updateCategory(id, category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);

        return ResponseEntity.ok("Category delete: " + id);
    }
    
    
    
}
