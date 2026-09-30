package com.antigravitycare.prms.controller;

import com.antigravitycare.prms.entity.Patient;
import com.antigravitycare.prms.repository.PatientRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@Tag(name = "Patient Management", description = "Endpoints for managing patient profiles, MRN generation, and demographics")
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @GetMapping
    @Operation(summary = "List all patients or filter by search keyword")
    public List<Patient> getAllPatients(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return patientRepository.searchPatients(search.trim());
        }
        return patientRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get patient by ID")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Register new patient profile with automated MRN")
    public ResponseEntity<Patient> createPatient(@Valid @RequestBody Patient patient) {
        if (patient.getMrn() == null || patient.getMrn().trim().isEmpty()) {
            long count = patientRepository.count() + 1;
            patient.setMrn(String.format("PAT-2026-%03d", count));
        }
        Patient saved = patientRepository.save(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update patient profile")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient updated) {
        return patientRepository.findById(id).map(patient -> {
            if (updated.getName() != null) patient.setName(updated.getName());
            if (updated.getPhone() != null) patient.setPhone(updated.getPhone());
            if (updated.getEmail() != null) patient.setEmail(updated.getEmail());
            if (updated.getDob() != null) patient.setDob(updated.getDob());
            if (updated.getGender() != null) patient.setGender(updated.getGender());
            if (updated.getBloodGroup() != null) patient.setBloodGroup(updated.getBloodGroup());
            if (updated.getAddress() != null) patient.setAddress(updated.getAddress());
            if (updated.getEmergencyContact() != null) patient.setEmergencyContact(updated.getEmergencyContact());
            if (updated.getAllergies() != null) patient.setAllergies(updated.getAllergies());
            if (updated.getChronicConditions() != null) patient.setChronicConditions(updated.getChronicConditions());
            if (updated.getStatus() != null) patient.setStatus(updated.getStatus());
            return ResponseEntity.ok(patientRepository.save(patient));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete patient record")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        if (!patientRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        patientRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Patient deleted successfully"));
    }
}
