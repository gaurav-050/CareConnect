package com.antigravitycare.prms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "medical_records")
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long patientId;
    private String patientName;

    @NotNull
    private Long doctorId;
    private String doctorName;

    private Long appointmentId;

    private LocalDate date = LocalDate.now();

    @NotBlank
    @Column(nullable = false)
    private String diagnosis;

    @Column(length = 1000)
    private String symptoms;

    @NotBlank
    @Column(length = 2000, nullable = false)
    private String clinicalNotes;

    private String followUpDate;

    public MedicalRecord() {}

    public MedicalRecord(Long patientId, String patientName, Long doctorId, String doctorName, Long appointmentId, LocalDate date, String diagnosis, String symptoms, String clinicalNotes, String followUpDate) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.appointmentId = appointmentId;
        this.date = date != null ? date : LocalDate.now();
        this.diagnosis = diagnosis;
        this.symptoms = symptoms;
        this.clinicalNotes = clinicalNotes;
        this.followUpDate = followUpDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }

    public String getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(String followUpDate) { this.followUpDate = followUpDate; }
}
