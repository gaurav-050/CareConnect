package com.antigravitycare.prms.controller;

import com.antigravitycare.prms.entity.Appointment;
import com.antigravitycare.prms.entity.Doctor;
import com.antigravitycare.prms.entity.MedicalRecord;
import com.antigravitycare.prms.entity.Patient;
import com.antigravitycare.prms.repository.AppointmentRepository;
import com.antigravitycare.prms.repository.DoctorRepository;
import com.antigravitycare.prms.repository.MedicalRecordRepository;
import com.antigravitycare.prms.repository.PatientRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medical-records")
@Tag(name = "Medical Records (EMR)", description = "Endpoints for clinical SOAP consultation notes, diagnoses, and visit timelines")
public class MedicalRecordController {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public MedicalRecordController(
            MedicalRecordRepository medicalRecordRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping
    @Operation(summary = "List medical records with optional patient or doctor filter")
    public List<MedicalRecord> getRecords(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId
    ) {
        if (patientId != null) {
            return medicalRecordRepository.findByPatientIdOrderByDateDesc(patientId);
        }
        if (doctorId != null) {
            return medicalRecordRepository.findByDoctorIdOrderByDateDesc(doctorId);
        }
        return medicalRecordRepository.findAllByOrderByDateDesc();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get clinical record by ID")
    public ResponseEntity<MedicalRecord> getRecordById(@PathVariable Long id) {
        return medicalRecordRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Record clinical consultation note and diagnosis")
    public ResponseEntity<?> createRecord(@Valid @RequestBody MedicalRecord record) {
        Patient patient = patientRepository.findById(record.getPatientId()).orElse(null);
        if (patient == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid patient ID"));
        }
        Doctor doctor = doctorRepository.findById(record.getDoctorId()).orElse(null);
        if (doctor == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid doctor ID"));
        }

        record.setPatientName(patient.getName());
        record.setDoctorName(doctor.getName());
        if (record.getDate() == null) {
            record.setDate(LocalDate.now());
        }

        MedicalRecord saved = medicalRecordRepository.save(record);

        // Auto-complete associated appointment if linked
        if (record.getAppointmentId() != null) {
            appointmentRepository.findById(record.getAppointmentId()).ifPresent(apt -> {
                apt.setStatus("COMPLETED");
                appointmentRepository.save(apt);
            });
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete clinical record")
    public ResponseEntity<?> deleteRecord(@PathVariable Long id) {
        if (!medicalRecordRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        medicalRecordRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Clinical record deleted"));
    }
}
