package com.antigravitycare.prms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "diagnostic_reports")
public class DiagnosticReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String reportNumber;

    @NotBlank
    @Column(nullable = false)
    private String title;

    private String category;

    @NotNull
    private Long patientId;
    private String patientName;

    @NotNull
    private Long doctorId;
    private String doctorName;

    private LocalDate date = LocalDate.now();

    @Column(length = 2000)
    private String summary;

    private String fileName;

    @Column(length = 1000)
    private String fileUrl;

    private String status = "Verified";

    public DiagnosticReport() {}

    public DiagnosticReport(String reportNumber, String title, String category, Long patientId, String patientName, Long doctorId, String doctorName, LocalDate date, String summary, String fileName, String fileUrl, String status) {
        this.reportNumber = reportNumber;
        this.title = title;
        this.category = category;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.date = date != null ? date : LocalDate.now();
        this.summary = summary;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.status = status != null ? status : "Verified";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReportNumber() { return reportNumber; }
    public void setReportNumber(String reportNumber) { this.reportNumber = reportNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
