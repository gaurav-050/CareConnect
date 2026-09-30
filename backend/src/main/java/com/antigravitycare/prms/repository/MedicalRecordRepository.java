package com.antigravitycare.prms.repository;

import com.antigravitycare.prms.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientIdOrderByDateDesc(Long patientId);
    List<MedicalRecord> findByDoctorIdOrderByDateDesc(Long doctorId);
    List<MedicalRecord> findAllByOrderByDateDesc();
}
