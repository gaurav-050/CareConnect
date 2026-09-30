package com.antigravitycare.prms.repository;

import com.antigravitycare.prms.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByMrn(String mrn);

    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.mrn) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "p.phone LIKE CONCAT('%', :query, '%')")
    List<Patient> searchPatients(@Param("query") String query);
}
