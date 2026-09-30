package com.antigravitycare.prms.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String rxNumber; // e.g. RX-501

    @NotNull
    private Long patientId;
    private String patientName;

    @NotNull
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;

    private LocalDate date = LocalDate.now();

    @Column(length = 1000)
    private String instructions;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<PrescriptionItem> items = new ArrayList<>();

    public Prescription() {}

    public Prescription(String rxNumber, Long patientId, String patientName, Long doctorId, String doctorName, String doctorSpecialization, LocalDate date, String instructions) {
        this.rxNumber = rxNumber;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.doctorSpecialization = doctorSpecialization;
        this.date = date != null ? date : LocalDate.now();
        this.instructions = instructions;
    }

    public void addItem(PrescriptionItem item) {
        items.add(item);
        item.setPrescription(this);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRxNumber() { return rxNumber; }
    public void setRxNumber(String rxNumber) { this.rxNumber = rxNumber; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDoctorSpecialization() { return doctorSpecialization; }
    public void setDoctorSpecialization(String doctorSpecialization) { this.doctorSpecialization = doctorSpecialization; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public List<PrescriptionItem> getItems() { return items; }
    public void setItems(List<PrescriptionItem> items) { this.items = items; }
}
