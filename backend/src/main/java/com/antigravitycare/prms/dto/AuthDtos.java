package com.antigravitycare.prms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {

    public static class LoginRequest {
        @NotBlank(message = "Email or username is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @NotBlank(message = "Username is required")
        private String username;

        @Email(message = "Valid email is required")
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        private String role; // "ROLE_PATIENT", "ROLE_DOCTOR", "ROLE_ADMIN"
        private String fullName;
        private String phone;

        public RegisterRequest() {}

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String username;
        private String email;
        private String role;
        private String fullName;

        public AuthResponse() {}

        public AuthResponse(String token, Long id, String username, String email, String role, String fullName) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
            this.fullName = fullName;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
    }
}
