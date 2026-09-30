-- ==============================================================================
-- CareConnect - Patient Record Management System (PRMS)
-- Database: MySQL 8.0+
-- Script: Schema Creation & Seed Data
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS careconnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE careconnect_db;

-- ------------------------------------------------------------------------------
-- 1. Table: users
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    full_name VARCHAR(150),
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 2. Table: doctors
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(50),
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(150),
    experience VARCHAR(50),
    department VARCHAR(100),
    room_no VARCHAR(50),
    consultation_fee DOUBLE DEFAULT 50.0,
    status VARCHAR(50) DEFAULT 'Available',
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 3. Table: patients
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS patients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mrn VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    address VARCHAR(255),
    emergency_contact VARCHAR(150),
    allergies VARCHAR(255),
    chronic_conditions VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 4. Table: appointments
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT NOT NULL,
    patient_name VARCHAR(150),
    doctor_id BIGINT NOT NULL,
    doctor_name VARCHAR(150),
    specialization VARCHAR(100),
    date_time DATETIME NOT NULL,
    reason VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_apt_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_apt_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 5. Table: medical_records
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medical_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    patient_name VARCHAR(150),
    doctor_id BIGINT NOT NULL,
    doctor_name VARCHAR(150),
    appointment_id BIGINT,
    date DATE NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    symptoms VARCHAR(500),
    clinical_notes TEXT,
    follow_up_date VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mr_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_mr_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 6. Table: prescriptions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS prescriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rx_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT NOT NULL,
    patient_name VARCHAR(150),
    doctor_id BIGINT NOT NULL,
    doctor_name VARCHAR(150),
    doctor_specialization VARCHAR(100),
    date DATE NOT NULL,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rx_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_rx_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 7. Table: prescription_items
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS prescription_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_id BIGINT NOT NULL,
    medicine VARCHAR(150) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    timing VARCHAR(100),
    CONSTRAINT fk_rx_item FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 8. Table: diagnostic_reports
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS diagnostic_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    patient_id BIGINT NOT NULL,
    patient_name VARCHAR(150),
    doctor_id BIGINT NOT NULL,
    doctor_name VARCHAR(150),
    date DATE NOT NULL,
    summary TEXT,
    file_name VARCHAR(255),
    file_url VARCHAR(1000),
    status VARCHAR(100) DEFAULT 'Verified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_report_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_report_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==============================================================================
-- SEED DATA INSERTION
-- BCrypt encoded passwords:
-- 'admin'   -> $2a$10$wE9Kj7aP.kY8sUeZgB4sduM6r9C9g2zE4O7.W2A3H6n4.N8yF6K0W (sample)
-- Note: In Spring Boot, DataInitializer auto-hashes passwords on first startup.
-- For manual DB imports, standard plain/bcrypt seeds are provided below.
-- ==============================================================================

-- Seed Users (passwords are BCrypt for admin, doctor, patient)
INSERT INTO users (username, email, password, role, full_name, avatar) VALUES
('admin', 'admin@careconnect.com', '$2a$10$e8w.b8G3pL4R0v0U/n3wRe9vU3L8J2P4q1Y6g2A4B6C8D0E2F4G6H', 'ROLE_ADMIN', 'Admin Officer', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'),
('doctor', 'doctor@careconnect.com', '$2a$10$e8w.b8G3pL4R0v0U/n3wRe9vU3L8J2P4q1Y6g2A4B6C8D0E2F4G6H', 'ROLE_DOCTOR', 'Dr. Sarah Jenkins', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'),
('patient', 'alex@example.com', '$2a$10$e8w.b8G3pL4R0v0U/n3wRe9vU3L8J2P4q1Y6g2A4B6C8D0E2F4G6H', 'ROLE_PATIENT', 'Alex Johnson', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Doctors
INSERT INTO doctors (id, name, email, phone, specialization, qualification, experience, department, room_no, consultation_fee, status, avatar) VALUES
(1, 'Dr. Sarah Jenkins', 'doctor@careconnect.com', '+1 555-0192', 'Cardiology', 'MBBS, MD (Cardiology)', '10 Years', 'Heart & Vascular', 'Room 302', 75.0, 'Available', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'),
(2, 'Dr. Michael Chen', 'michael.chen@careconnect.com', '+1 555-0193', 'General Medicine', 'MBBS, DNB (Internal Med)', '8 Years', 'Outpatient Clinic', 'Room 105', 50.0, 'Available', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'),
(3, 'Dr. Emily Rodriguez', 'emily.rodriguez@careconnect.com', '+1 555-0194', 'Pediatrics', 'MBBS, MD (Pediatrics)', '6 Years', 'Child Care', 'Room 204', 60.0, 'In Consultation', 'https://images.unsplash.com/photo-1594824813583-149b5c2a39a7?w=150&auto=format&fit=crop&q=80'),
(4, 'Dr. Robert Vance', 'robert.vance@careconnect.com', '+1 555-0195', 'Orthopedics', 'MS (Orthopedics), FRCS', '14 Years', 'Bone & Joint', 'Room 401', 90.0, 'Available', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Patients
INSERT INTO patients (id, mrn, name, email, phone, dob, gender, blood_group, address, emergency_contact, allergies, chronic_conditions, status) VALUES
(1, 'PAT-2026-001', 'Alex Johnson', 'alex@example.com', '+1 555-3829', '1994-06-15', 'Male', 'O+', '42 Elm Street, Springfield', 'Maria Johnson (+1 555-9988)', 'Penicillin, Peanuts', 'Mild Asthma', 'Active'),
(2, 'PAT-2026-002', 'Sophia Martinez', 'sophia.m@example.com', '+1 555-7281', '1988-11-22', 'Female', 'A+', '108 Sunset Blvd, Los Angeles', 'David Martinez (+1 555-4433)', 'Sulfa Drugs', 'Hypertension', 'Active'),
(3, 'PAT-2026-003', 'David Kim', 'david.kim@example.com', '+1 555-1920', '2001-03-08', 'Male', 'B+', '77 Pine Road, Chicago', 'Grace Kim (+1 555-8811)', 'None reported', 'None', 'Active'),
(4, 'PAT-2026-004', 'Emma Watson', 'emma.watson@example.com', '+1 555-6677', '1997-09-30', 'Female', 'AB+', '15 Beacon Hill, Boston', 'John Watson (+1 555-2233)', 'Aspirin', 'Seasonal Allergies', 'Active')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Appointments
INSERT INTO appointments (id, appointment_number, patient_id, patient_name, doctor_id, doctor_name, specialization, date_time, reason, status) VALUES
(1, 'APT-1001', 1, 'Alex Johnson', 1, 'Dr. Sarah Jenkins', 'Cardiology', '2026-10-01 10:00:00', 'Quarterly heart rate checkup & palpitations review', 'SCHEDULED'),
(2, 'APT-1002', 2, 'Sophia Martinez', 2, 'Dr. Michael Chen', 'General Medicine', '2026-09-30 14:30:00', 'High blood pressure follow-up and refill', 'CONFIRMED'),
(3, 'APT-1003', 3, 'David Kim', 4, 'Dr. Robert Vance', 'Orthopedics', '2026-09-29 11:15:00', 'Right knee pain after sports training', 'COMPLETED'),
(4, 'APT-1004', 4, 'Emma Watson', 1, 'Dr. Sarah Jenkins', 'Cardiology', '2026-09-28 09:00:00', 'Pre-employment ECG clearance', 'COMPLETED')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Medical Records
INSERT INTO medical_records (id, patient_id, patient_name, doctor_id, doctor_name, appointment_id, date, diagnosis, symptoms, clinical_notes, follow_up_date) VALUES
(1, 1, 'Alex Johnson', 1, 'Dr. Sarah Jenkins', 1, '2026-09-26', 'Sinus Tachycardia (Stress induced)', 'Mild palpitations, fatigue during night shifts', 'Normal heart sounds, resting BP 124/82 mmHg, resting HR 96 bpm. ECG shows normal sinus rhythm with mild tachycardia. Advised reduction in caffeine intake and lifestyle modification.', '2026-10-25'),
(2, 3, 'David Kim', 4, 'Dr. Robert Vance', 3, '2026-09-29', 'Grade 1 Medial Collateral Ligament (MCL) Strain', 'Swelling and tenderness along inner right knee joint', 'No joint laxity or locking detected. X-Ray negative for fracture. RICE protocol recommended with knee brace for 10 days.', '2026-10-12')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Prescriptions
INSERT INTO prescriptions (id, rx_number, patient_id, patient_name, doctor_id, doctor_name, doctor_specialization, date, instructions) VALUES
(1, 'RX-501', 1, 'Alex Johnson', 1, 'Dr. Sarah Jenkins', 'Cardiology', '2026-09-26', 'Take with water. Avoid strenuous workouts immediately after dosing.'),
(2, 'RX-502', 3, 'David Kim', 4, 'Dr. Robert Vance', 'Orthopedics', '2026-09-29', 'Apply cold compress 3 times daily. Avoid running.')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Prescription Items
INSERT INTO prescription_items (prescription_id, medicine, dosage, frequency, duration, timing) VALUES
(1, 'Propranolol 10mg', '1 Tablet', 'Twice daily (Morning & Evening)', '14 Days', 'After Food'),
(1, 'Multivitamin B-Complex', '1 Capsule', 'Once daily', '30 Days', 'After Breakfast'),
(2, 'Ibuprofen 400mg', '1 Tablet', 'Twice daily as needed for pain', '5 Days', 'After Food'),
(2, 'Diclofenac Sodium Gel 1%', 'Thin layer', '3 times daily', '7 Days', 'Topical application');

-- Seed Diagnostic Reports
INSERT INTO diagnostic_reports (id, report_number, title, category, patient_id, patient_name, doctor_id, doctor_name, date, summary, file_name, file_url, status) VALUES
(1, 'REP-9001', 'Comprehensive Metabolic & Lipid Profile', 'Pathology & Blood', 1, 'Alex Johnson', 1, 'Dr. Sarah Jenkins', '2026-09-26', 'Resting fasting blood glucose 94 mg/dL. Total cholesterol 188 mg/dL. Normal electrolyte balance.', 'Blood_Metabolic_Panel_Sept2026.pdf', 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80', 'Verified & Normal'),
(2, 'REP-9002', '12-Lead Diagnostic Electrocardiogram (ECG)', 'Cardiology', 1, 'Alex Johnson', 1, 'Dr. Sarah Jenkins', '2026-09-25', 'Normal sinus rhythm, heart rate 94 bpm. Mild sinus tachycardia, no ischemic ST changes.', '12_Lead_ECG_Trace_Report.pdf', 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80', 'Reviewed by Cardiologist'),
(3, 'REP-9003', 'Right Knee Digital Radiography (X-Ray)', 'Radiology / Imaging', 3, 'David Kim', 4, 'Dr. Robert Vance', '2026-09-28', 'AP and Lateral views. No cortical breach or acute fracture. Soft tissue swelling over medial collateral ligament.', 'Knee_XRay_AP_Lateral.pdf', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80', 'Normal Bones / Soft Tissue Sprain')
ON DUPLICATE KEY UPDATE id=id;
