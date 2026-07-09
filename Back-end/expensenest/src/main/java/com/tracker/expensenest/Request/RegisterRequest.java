package com.tracker.expensenest.Request;

import lombok.Data;

@Data
public class RegisterRequest {
    
    private String first_name;
    private String last_name;
    private String email;
    private String password;
}
