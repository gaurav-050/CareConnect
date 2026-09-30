package com.antigravitycare.prms.controller;

import com.antigravitycare.prms.entity.Appointment;
import com.antigravitycare.prms.entity.Doctor;
import com.antigravitycare.prms.entity.Patient;
import com.antigravitycare.prms.repository.AppointmentRepository;
import com.antigravitycare.prms.repository.DoctorRepository;
import com.antigravitycare.prms.repository.PatientRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors")
@Tag(name = "Doctor Management", description = "Endpoints for doctor onboarding, profiles, specializations, and patient rosters")
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    public DoctorController(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository, PatientRepository patientRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping
    @Operation(summary = "List all doctors or filter by specialization")
    public List<Doctor> getAllDoctors(@RequestParam(required = false) String specialization) {
        if (specialization != null && !specialization.trim().equalsIgnoreCase("ALL") && !specialization.trim().isEmpty()) {
            return doctorRepository.findBySpecializationIgnoreCase(specialization.trim());
        }
        return doctorRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get doctor profile by ID")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Onboard new doctor")
    public ResponseEntity<Doctor> createDoctor(@Valid @RequestBody Doctor doctor) {
        if (doctor.getAvatar() == null || doctor.getAvatar().trim().isEmpty()) {
            doctor.setAvatar("https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80");
        }
        Doctor saved = doctorRepository.save(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update doctor profile")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor updated) {
        return doctorRepository.findById(id).map(d -> {
            if (updated.getName() != null) d.setName(updated.getName());
            if (updated.getEmail() != null) d.setEmail(updated.getEmail());
            if (updated.getPhone() != null) d.setPhone(updated.getPhone());
            if (updated.getSpecialization() != null) d.setSpecialization(updated.getSpecialization());
            if (updated.getQualification() != null) d.setQualification(updated.getQualification());
            if (updated.getExperience() != null) d.setExperience(updated.getExperience());
            if (updated.getDepartment() != null) d.setDepartment(updated.getDepartment());
            if (updated.getRoomNo() != null) d.setRoomNo(updated.getRoomNo());
            if (updated.getConsultationFee() != null) d.setConsultationFee(updated.getConsultationFee());
            if (updated.getStatus() != null) d.setStatus(updated.getStatus());
            return ResponseEntity.ok(doctorRepository.save(d));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/patients")
    @Operation(summary = "Get list of patients who have consulted with this doctor")
    public ResponseEntity<?> getAssignedPatients(@PathVariable Long id) {
        if (!doctorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        List<Appointment> appointments = appointmentRepository.findByDoctorIdOrderByDateTimeDesc(id);
        Set<Long> patientIds = appointments.stream().map(Appointment::getPatientId).collect(Collectors.toSet());
        List<Patient> patients = patientRepository.findAllById(patientIds);
        return ResponseEntity.ok(patients);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove doctor record")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        if (!doctorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        doctorRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Doctor removed successfully"));
    }
}
