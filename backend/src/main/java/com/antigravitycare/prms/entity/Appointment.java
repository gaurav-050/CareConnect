package com.antigravitycare.prms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String appointmentNumber; // e.g. APT-1001

    @NotNull
    private Long patientId;
    private String patientName;

    @NotNull
    private Long doctorId;
    private String doctorName;
    private String specialization;

    @NotNull
    private LocalDateTime dateTime;

    @NotBlank
    @Column(length = 1000)
    private String reason;

    private String status = "SCHEDULED"; // SCHEDULED, CONFIRMED, COMPLETED, CANCELLED

    public Appointment() {}

    public Appointment(String appointmentNumber, Long patientId, String patientName, Long doctorId, String doctorName, String specialization, LocalDateTime dateTime, String reason) {
        this.appointmentNumber = appointmentNumber;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.specialization = specialization;
        this.dateTime = dateTime;
        this.reason = reason;
        this.status = "SCHEDULED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAppointmentNumber() { return appointmentNumber; }
    public void setAppointmentNumber(String appointmentNumber) { this.appointmentNumber = appointmentNumber; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
