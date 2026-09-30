package com.antigravitycare.prms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String mrn; // Medical Record Number (e.g. PAT-2026-001)

    @NotBlank
    @Column(nullable = false)
    private String name;

    private String email;

    @NotBlank
    @Column(nullable = false)
    private String phone;

    private LocalDate dob;
    private String gender;
    private String bloodGroup;
    private String address;
    private String emergencyContact;
    private String allergies;
    private String chronicConditions;
    private String status = "Active";

    public Patient() {}

    public Patient(String mrn, String name, String email, String phone, LocalDate dob, String gender, String bloodGroup, String address, String emergencyContact, String allergies, String chronicConditions) {
        this.mrn = mrn;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.dob = dob;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.allergies = allergies;
        this.chronicConditions = chronicConditions;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMrn() { return mrn; }
    public void setMrn(String mrn) { this.mrn = mrn; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getChronicConditions() { return chronicConditions; }
    public void setChronicConditions(String chronicConditions) { this.chronicConditions = chronicConditions; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
