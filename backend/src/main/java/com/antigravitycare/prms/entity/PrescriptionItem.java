package com.antigravitycare.prms.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "prescription_items")
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id")
    @JsonBackReference
    private Prescription prescription;

    @NotBlank
    @Column(nullable = false)
    private String medicine;

    private String dosage;
    private String frequency;
    private String duration;
    private String timing;

    public PrescriptionItem() {}

    public PrescriptionItem(String medicine, String dosage, String frequency, String duration, String timing) {
        this.medicine = medicine;
        this.dosage = dosage;
        this.frequency = frequency;
        this.duration = duration;
        this.timing = timing;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Prescription getPrescription() { return prescription; }
    public void setPrescription(Prescription prescription) { this.prescription = prescription; }

    public String getMedicine() { return medicine; }
    public void setMedicine(String medicine) { this.medicine = medicine; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getTiming() { return timing; }
    public void setTiming(String timing) { this.timing = timing; }
}
