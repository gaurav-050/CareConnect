package com.antigravitycare.prms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    private String email;
    private String phone;

    @NotBlank
    @Column(nullable = false)
    private String specialization;

    private String qualification;
    private String experience;
    private String department;
    private String roomNo;
    private Double consultationFee = 50.0;
    private String status = "Available"; // "Available", "In Consultation", "On Leave"
    private String avatar;

    public Doctor() {}

    public Doctor(String name, String email, String phone, String specialization, String qualification, String experience, String department, String roomNo, Double consultationFee) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experience = experience;
        this.department = department;
        this.roomNo = roomNo;
        this.consultationFee = consultationFee;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getRoomNo() { return roomNo; }
    public void setRoomNo(String roomNo) { this.roomNo = roomNo; }

    public Double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(Double consultationFee) { this.consultationFee = consultationFee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
}
