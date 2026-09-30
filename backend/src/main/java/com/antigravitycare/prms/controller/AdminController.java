package com.antigravitycare.prms.controller;

import com.antigravitycare.prms.config.DataInitializer;
import com.antigravitycare.prms.dto.DashboardStatsDto;
import com.antigravitycare.prms.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Management", description = "Endpoints for practice management KPI dashboard and database administration")
public class AdminController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    private final DataInitializer dataInitializer;

    public AdminController(
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository,
            MedicalRecordRepository medicalRecordRepository,
            PrescriptionRepository prescriptionRepository,
            UserRepository userRepository,
            DataInitializer dataInitializer
    ) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.userRepository = userRepository;
        this.dataInitializer = dataInitializer;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get aggregated practice KPI statistics")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointmentRepository.count();
        long pending = appointmentRepository.countByStatus("SCHEDULED") + appointmentRepository.countByStatus("CONFIRMED");
        long completed = appointmentRepository.countByStatus("COMPLETED");
        long totalRecords = medicalRecordRepository.count();

        DashboardStatsDto stats = new DashboardStatsDto(
                totalPatients,
                totalDoctors,
                totalAppointments,
                pending,
                completed,
                totalRecords
        );
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/reset-database")
    @Operation(summary = "Reset database and re-seed default demo data")
    public ResponseEntity<?> resetDatabase() {
        prescriptionRepository.deleteAll();
        medicalRecordRepository.deleteAll();
        appointmentRepository.deleteAll();
        doctorRepository.deleteAll();
        patientRepository.deleteAll();
        userRepository.deleteAll();

        dataInitializer.run();

        return ResponseEntity.ok(Map.of("message", "Database successfully reset and re-seeded with demo records"));
    }
}
