package com.antigravitycare.prms.repository;

import com.antigravitycare.prms.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientIdOrderByDateDesc(Long patientId);
    List<Prescription> findByDoctorIdOrderByDateDesc(Long doctorId);
    List<Prescription> findAllByOrderByDateDesc();
}
