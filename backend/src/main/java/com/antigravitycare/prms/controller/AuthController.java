package com.antigravitycare.prms.controller;

import com.antigravitycare.prms.config.JwtService;
import com.antigravitycare.prms.dto.AuthDtos.*;
import com.antigravitycare.prms.entity.Patient;
import com.antigravitycare.prms.entity.User;
import com.antigravitycare.prms.repository.PatientRepository;
import com.antigravitycare.prms.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration, login, and JWT token issuance")
public class AuthController {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT token")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .or(() -> userRepository.findByUsername(request.getEmail()))
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getId());
        AuthResponse response = new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.getFullName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user account (e.g. Patient)")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already registered"));
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is already taken"));
        }

        String assignedRole = request.getRole() != null ? request.getRole() : "ROLE_PATIENT";
        User newUser = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                assignedRole,
                request.getFullName() != null ? request.getFullName() : request.getUsername()
        );
        User savedUser = userRepository.save(newUser);

        // Auto-create patient record if registering as patient
        if ("ROLE_PATIENT".equalsIgnoreCase(assignedRole)) {
            long count = patientRepository.count() + 1;
            Patient newPatient = new Patient(
                    "PAT-2026-00" + count,
                    newUser.getFullName(),
                    newUser.getEmail(),
                    request.getPhone() != null ? request.getPhone() : "+1 555-0000",
                    LocalDate.of(2000, 1, 1),
                    "Not Specified",
                    "O+",
                    "Local Resident",
                    "Not Provided",
                    "None recorded",
                    "None"
            );
            patientRepository.save(newPatient);
        }

        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole(), savedUser.getId());
        AuthResponse response = new AuthResponse(token, savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(), savedUser.getRole(), savedUser.getFullName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<?> getCurrentUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }
        User user = userRepository.findByEmail(auth.getName())
                .or(() -> userRepository.findByUsername(auth.getName()))
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset user password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .or(() -> userRepository.findByUsername(request.getEmail()))
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "No account found with this email or username"));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password has been successfully updated. You can now sign in with your new password."));
    }
}
