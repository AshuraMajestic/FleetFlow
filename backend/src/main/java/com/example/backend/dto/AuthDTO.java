package com.example.backend.dto;

import com.example.backend.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        @NotBlank
        @Email
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank
        @Email
        private String email;
        @NotBlank
        private String password;
        @NotBlank
        private String name;
        private String phone;
        private String address;
        @NotNull
        private UserRole role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String email;
        private String name;
        private String phone;
        private String address;
        private UserRole role;
        private Boolean isApproved;
        private String tokenType = "Bearer";

        public AuthResponse(String token, String email, String name, String phone, String address, UserRole role, Boolean isApproved) {
            this.token = token;
            this.email = email;
            this.name = name;
            this.phone = phone;
            this.address = address;
            this.role = role;
            this.isApproved = isApproved;
        }
    }
}