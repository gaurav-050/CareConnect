package com.antigravitycare.prms.controller;

import com.antigravitycare.prms.entity.DiagnosticReport;
import com.antigravitycare.prms.entity.Doctor;
import com.antigravitycare.prms.entity.Patient;
import com.antigravitycare.prms.repository.DiagnosticReportRepository;
import com.antigravitycare.prms.repository.DoctorRepository;
import com.antigravitycare.prms.repository.PatientRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Diagnostic Reports", description = "Endpoints for uploading, searching, and accessing patient diagnostic and laboratory test reports")
public class DiagnosticReportController {

    private final DiagnosticReportRepository reportRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public DiagnosticReportController(
            DiagnosticReportRepository reportRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository
    ) {
        this.reportRepository = reportRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    @Operation(summary = "List diagnostic reports with optional patient or doctor filter")
    public List<DiagnosticReport> getReports(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) String category
    ) {
        if (patientId != null) {
            return reportRepository.findByPatientIdOrderByDateDesc(patientId);
        }
        if (doctorId != null) {
            return reportRepository.findByDoctorIdOrderByDateDesc(doctorId);
        }
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            return reportRepository.findByCategoryIgnoreCase(category.trim());
        }
        return reportRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get diagnostic report by ID")
    public ResponseEntity<DiagnosticReport> getReportById(@PathVariable Long id) {
        return reportRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Upload and attach a new patient diagnostic report")
    public ResponseEntity<?> createReport(@Valid @RequestBody DiagnosticReport report) {
        if (report.getPatientId() != null && (report.getPatientName() == null || report.getPatientName().isBlank())) {
            patientRepository.findById(report.getPatientId()).ifPresent(p -> report.setPatientName(p.getName()));
        }
        if (report.getDoctorId() != null && (report.getDoctorName() == null || report.getDoctorName().isBlank())) {
            doctorRepository.findById(report.getDoctorId()).ifPresent(d -> report.setDoctorName(d.getName()));
        }

        if (report.getReportNumber() == null || report.getReportNumber().isBlank()) {
            long count = reportRepository.count();
            report.setReportNumber(String.format("REP-%04d", 9001 + count));
        }

        if (report.getDate() == null) {
            report.setDate(LocalDate.now());
        }

        if (report.getStatus() == null || report.getStatus().isBlank()) {
            report.setStatus("Verified & Uploaded");
        }

        DiagnosticReport saved = reportRepository.save(report);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete diagnostic report")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        if (!reportRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reportRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Diagnostic report removed successfully"));
    }
}
