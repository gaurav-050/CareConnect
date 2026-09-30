package com.antigravitycare.prms.repository;

import com.antigravitycare.prms.entity.DiagnosticReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosticReportRepository extends JpaRepository<DiagnosticReport, Long> {
    List<DiagnosticReport> findByPatientIdOrderByDateDesc(Long patientId);
    List<DiagnosticReport> findByDoctorIdOrderByDateDesc(Long doctorId);
    List<DiagnosticReport> findByCategoryIgnoreCase(String category);
}
