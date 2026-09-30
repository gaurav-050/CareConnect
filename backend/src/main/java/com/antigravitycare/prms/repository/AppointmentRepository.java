package com.antigravitycare.prms.repository;

import com.antigravitycare.prms.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdOrderByDateTimeDesc(Long patientId);
    List<Appointment> findByDoctorIdOrderByDateTimeDesc(Long doctorId);
    List<Appointment> findByStatusOrderByDateTimeDesc(String status);
    List<Appointment> findAllByOrderByDateTimeDesc();
    long countByStatus(String status);
}
