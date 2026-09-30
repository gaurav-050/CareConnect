package com.antigravitycare.prms.repository;

import com.antigravitycare.prms.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializationIgnoreCase(String specialization);
    List<Doctor> findByStatus(String status);
}
