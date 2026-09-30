package com.antigravitycare.prms.controller;

import com.antigravitycare.prms.entity.Doctor;
import com.antigravitycare.prms.entity.Patient;
import com.antigravitycare.prms.entity.Prescription;
import com.antigravitycare.prms.entity.PrescriptionItem;
import com.antigravitycare.prms.repository.DoctorRepository;
import com.antigravitycare.prms.repository.PatientRepository;
import com.antigravitycare.prms.repository.PrescriptionRepository;
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
@RequestMapping("/api/prescriptions")
@Tag(name = "Prescriptions", description = "Endpoints for authoring, retrieving, and generating printable medical prescriptions")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public PrescriptionController(
            PrescriptionRepository prescriptionRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository
    ) {
        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    @Operation(summary = "List prescriptions with optional patient or doctor filter")
    public List<Prescription> getPrescriptions(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId
    ) {
        if (patientId != null) {
            return prescriptionRepository.findByPatientIdOrderByDateDesc(patientId);
        }
        if (doctorId != null) {
            return prescriptionRepository.findByDoctorIdOrderByDateDesc(doctorId);
        }
        return prescriptionRepository.findAllByOrderByDateDesc();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get prescription details and medication line items by ID")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        return prescriptionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create e-prescription with medication line items")
    public ResponseEntity<?> createPrescription(@Valid @RequestBody Prescription prescription) {
        Patient patient = patientRepository.findById(prescription.getPatientId()).orElse(null);
        if (patient == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid patient ID"));
        }
        Doctor doctor = doctorRepository.findById(prescription.getDoctorId()).orElse(null);
        if (doctor == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid doctor ID"));
        }

        long count = prescriptionRepository.count() + 1;
        prescription.setRxNumber("RX-" + (500 + count));
        prescription.setPatientName(patient.getName());
        prescription.setDoctorName(doctor.getName());
        prescription.setDoctorSpecialization(doctor.getSpecialization());
        if (prescription.getDate() == null) {
            prescription.setDate(LocalDate.now());
        }

        if (prescription.getItems() != null) {
            for (PrescriptionItem item : prescription.getItems()) {
                item.setPrescription(prescription);
            }
        }

        Prescription saved = prescriptionRepository.save(prescription);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete prescription")
    public ResponseEntity<?> deletePrescription(@PathVariable Long id) {
        if (!prescriptionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        prescriptionRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Prescription deleted"));
    }
}
