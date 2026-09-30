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

@RestController
@RequestMapping("/api/appointments")
@Tag(name = "Appointment Management", description = "Endpoints for booking visits, viewing queues, and status transitions")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentController(AppointmentRepository appointmentRepository, PatientRepository patientRepository, DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    @Operation(summary = "List appointments with optional status, patient, or doctor filters")
    public List<Appointment> getAppointments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId
    ) {
        if (patientId != null) {
            return appointmentRepository.findByPatientIdOrderByDateTimeDesc(patientId);
        }
        if (doctorId != null) {
            return appointmentRepository.findByDoctorIdOrderByDateTimeDesc(doctorId);
        }
        if (status != null && !status.trim().equalsIgnoreCase("ALL") && !status.trim().isEmpty()) {
            return appointmentRepository.findByStatusOrderByDateTimeDesc(status.toUpperCase().trim());
        }
        return appointmentRepository.findAllByOrderByDateTimeDesc();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get appointment details by ID")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Book new appointment")
    public ResponseEntity<?> createAppointment(@Valid @RequestBody Appointment appointment) {
        Patient patient = patientRepository.findById(appointment.getPatientId()).orElse(null);
        if (patient == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid patient ID"));
        }
        Doctor doctor = doctorRepository.findById(appointment.getDoctorId()).orElse(null);
        if (doctor == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid doctor ID"));
        }

        long count = appointmentRepository.count() + 1;
        appointment.setAppointmentNumber("APT-" + (1000 + count));
        appointment.setPatientName(patient.getName());
        appointment.setDoctorName(doctor.getName());
        appointment.setSpecialization(doctor.getSpecialization());
        if (appointment.getStatus() == null) {
            appointment.setStatus("SCHEDULED");
        }

        Appointment saved = appointmentRepository.save(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update appointment status (e.g. COMPLETED, CANCELLED, CONFIRMED)")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusBody) {
        String newStatus = statusBody.get("status");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status field is required"));
        }

        return appointmentRepository.findById(id).map(apt -> {
            apt.setStatus(newStatus.toUpperCase().trim());
            return ResponseEntity.ok(appointmentRepository.save(apt));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel / delete appointment")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        if (!appointmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        appointmentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled and removed"));
    }
}
