package com.antigravitycare.prms.config;

import com.antigravitycare.prms.entity.*;
import com.antigravitycare.prms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository,
            MedicalRecordRepository medicalRecordRepository,
            PrescriptionRepository prescriptionRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Seed Users
        User admin = new User("admin", "admin@careconnect.com", passwordEncoder.encode("admin"), "ROLE_ADMIN", "Admin Officer");
        User docUser = new User("doctor", "doctor@careconnect.com", passwordEncoder.encode("doctor"), "ROLE_DOCTOR", "Dr. Sarah Jenkins");
        User patUser = new User("patient", "alex@example.com", passwordEncoder.encode("patient"), "ROLE_PATIENT", "Alex Johnson");
        userRepository.save(admin);
        userRepository.save(docUser);
        userRepository.save(patUser);

        // 2. Seed Doctors
        Doctor d1 = new Doctor("Dr. Sarah Jenkins", "doctor@careconnect.com", "+1 555-0192", "Cardiology", "MBBS, MD (Cardiology)", "10 Years", "Heart & Vascular", "Room 302", 75.0);
        d1.setAvatar("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80");

        Doctor d2 = new Doctor("Dr. Michael Chen", "michael.chen@careconnect.com", "+1 555-0193", "General Medicine", "MBBS, DNB (Internal Med)", "8 Years", "Outpatient Clinic", "Room 105", 50.0);
        d2.setAvatar("https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80");

        Doctor d3 = new Doctor("Dr. Emily Rodriguez", "emily.rodriguez@careconnect.com", "+1 555-0194", "Pediatrics", "MBBS, MD (Pediatrics)", "6 Years", "Child Care", "Room 204", 60.0);
        d3.setStatus("In Consultation");
        d3.setAvatar("https://images.unsplash.com/photo-1594824813583-149b5c2a39a7?w=150&auto=format&fit=crop&q=80");

        Doctor d4 = new Doctor("Dr. Robert Vance", "robert.vance@careconnect.com", "+1 555-0195", "Orthopedics", "MS (Orthopedics), FRCS", "14 Years", "Bone & Joint", "Room 401", 90.0);
        d4.setAvatar("https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80");

        doctorRepository.save(d1);
        doctorRepository.save(d2);
        doctorRepository.save(d3);
        doctorRepository.save(d4);

        // 3. Seed Patients
        Patient p1 = new Patient("PAT-2026-001", "Alex Johnson", "alex@example.com", "+1 555-3829", LocalDate.of(1994, 6, 15), "Male", "O+", "42 Elm Street, Springfield", "Maria Johnson (+1 555-9988)", "Penicillin, Peanuts", "Mild Asthma");
        Patient p2 = new Patient("PAT-2026-002", "Sophia Martinez", "sophia.m@example.com", "+1 555-7281", LocalDate.of(1988, 11, 22), "Female", "A+", "108 Sunset Blvd, Los Angeles", "David Martinez (+1 555-4433)", "Sulfa Drugs", "Hypertension");
        Patient p3 = new Patient("PAT-2026-003", "David Kim", "david.kim@example.com", "+1 555-1920", LocalDate.of(2001, 3, 8), "Male", "B+", "77 Pine Road, Chicago", "Grace Kim (+1 555-8811)", "None reported", "None");
        Patient p4 = new Patient("PAT-2026-004", "Emma Watson", "emma.watson@example.com", "+1 555-6677", LocalDate.of(1997, 9, 30), "Female", "AB+", "15 Beacon Hill, Boston", "John Watson (+1 555-2233)", "Aspirin", "Seasonal Allergies");

        patientRepository.save(p1);
        patientRepository.save(p2);
        patientRepository.save(p3);
        patientRepository.save(p4);

        // 4. Seed Appointments
        Appointment apt1 = new Appointment("APT-1001", p1.getId(), p1.getName(), d1.getId(), d1.getName(), d1.getSpecialization(), LocalDateTime.now().plusDays(1).withHour(10).withMinute(0), "Quarterly heart rate checkup & palpitations review");
        Appointment apt2 = new Appointment("APT-1002", p2.getId(), p2.getName(), d2.getId(), d2.getName(), d2.getSpecialization(), LocalDateTime.now().plusHours(3), "High blood pressure follow-up and refill");
        apt2.setStatus("CONFIRMED");

        Appointment apt3 = new Appointment("APT-1003", p3.getId(), p3.getName(), d4.getId(), d4.getName(), d4.getSpecialization(), LocalDateTime.now().minusDays(1), "Right knee pain after sports training");
        apt3.setStatus("COMPLETED");

        Appointment apt4 = new Appointment("APT-1004", p4.getId(), p4.getName(), d1.getId(), d1.getName(), d1.getSpecialization(), LocalDateTime.now().minusDays(2), "Pre-employment ECG clearance");
        apt4.setStatus("COMPLETED");

        appointmentRepository.save(apt1);
        appointmentRepository.save(apt2);
        appointmentRepository.save(apt3);
        appointmentRepository.save(apt4);

        // 5. Seed Medical Records
        MedicalRecord rec1 = new MedicalRecord(
                p1.getId(), p1.getName(), d1.getId(), d1.getName(), apt1.getId(),
                LocalDate.now().minusDays(4),
                "Sinus Tachycardia (Stress induced)",
                "Mild palpitations, fatigue during night shifts",
                "Normal heart sounds, resting BP 124/82 mmHg, resting HR 96 bpm. ECG shows normal sinus rhythm with mild tachycardia. Advised lifestyle modification.",
                "2026-10-25"
        );

        MedicalRecord rec2 = new MedicalRecord(
                p3.getId(), p3.getName(), d4.getId(), d4.getName(), apt3.getId(),
                LocalDate.now().minusDays(1),
                "Grade 1 Medial Collateral Ligament (MCL) Strain",
                "Swelling and tenderness along inner right knee joint",
                "No joint laxity or locking. X-Ray negative for fracture. RICE protocol recommended with knee brace for 10 days.",
                "2026-10-12"
        );

        medicalRecordRepository.save(rec1);
        medicalRecordRepository.save(rec2);

        // 6. Seed Prescriptions
        Prescription rx1 = new Prescription("RX-501", p1.getId(), p1.getName(), d1.getId(), d1.getName(), d1.getSpecialization(), LocalDate.now().minusDays(4), "Take with water. Avoid strenuous workouts immediately after dosing.");
        rx1.addItem(new PrescriptionItem("Propranolol 10mg", "1 Tablet", "Twice daily (Morning & Evening)", "14 Days", "After Food"));
        rx1.addItem(new PrescriptionItem("Multivitamin B-Complex", "1 Capsule", "Once daily", "30 Days", "After Breakfast"));
        prescriptionRepository.save(rx1);

        Prescription rx2 = new Prescription("RX-502", p3.getId(), p3.getName(), d4.getId(), d4.getName(), d4.getSpecialization(), LocalDate.now().minusDays(1), "Apply cold compress 3 times daily. Avoid running.");
        rx2.addItem(new PrescriptionItem("Ibuprofen 400mg", "1 Tablet", "Twice daily as needed for pain", "5 Days", "After Food"));
        rx2.addItem(new PrescriptionItem("Diclofenac Sodium Gel 1%", "Thin layer", "3 times daily", "7 Days", "Topical application"));
        prescriptionRepository.save(rx2);
    }
}
