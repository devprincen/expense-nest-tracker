package com.tracker.expensenest.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.tracker.expensenest.model.Category;
import com.tracker.expensenest.repository.CategoryRepo;

@Service
public class CategoryService {
    

    private final CategoryRepo categoryRepo;

    CategoryService(CategoryRepo categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    public Category saveCategory(Category category){
        return categoryRepo.save(category);
    }

    public Category updateCategory(UUID id, Category category) {
        
        Category oldCategory = categoryRepo.findById(id).orElseThrow();

        oldCategory.setCategoryName(category.getCategoryName());
        oldCategory.setCategoryDescription(category.getCategoryDescription());
        oldCategory.setCategoryType(category.getCategoryType());

        return categoryRepo.save(oldCategory);
        
    }

    public void deleteCategory(UUID id) {
        
        categoryRepo.deleteById(id);
    }

}
