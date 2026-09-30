# CareConnect - Database Architecture & Configuration Guide

This project supports two database modes:
1. **H2 In-Memory Database** (Default — Zero installation, runs immediately for viva/college demos).
2. **MySQL Database** (Production-ready — for XAMPP, WampServer, or standalone MySQL Server).

---

## 1. Option 1: H2 In-Memory Database (Default)

The project is preconfigured to run on H2 with zero external setup. When you launch the Spring Boot backend, tables and mock data are created automatically.

- **Web Console URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **Driver Class**: `org.h2.Driver`
- **JDBC URL**: `jdbc:h2:mem:careconnect_db`
- **User Name**: `sa`
- **Password**: *(leave completely empty)*

### Steps to Access:
1. Run `run-backend.bat` or `.\mvnw.cmd spring-boot:run`.
2. Open your browser and go to `http://localhost:8080/h2-console`.
3. In the login screen, make sure **JDBC URL** is set to `jdbc:h2:mem:careconnect_db`.
4. Click **Connect**. You will see all 8 tables and can execute SQL queries directly!

---

## 2. Option 2: MySQL Database

If you wish to use MySQL (via MySQL Workbench, phpMyAdmin, or terminal):

### Step 1: Create Database & Tables
Open MySQL Workbench or your terminal and execute:
```sql
CREATE DATABASE careconnect_db;
```
Then run the provided SQL script:
- Path: `database/careconnect_schema_mysql.sql`

Or run via command line:
```bash
mysql -u root -p careconnect_db < database/careconnect_schema_mysql.sql
```

### Step 2: Switch Database in `backend/src/main/resources/application.properties`
Comment out the H2 lines and uncomment the MySQL lines:
```properties
# H2 Configuration (Comment these lines)
# spring.datasource.url=jdbc:h2:mem:careconnect_db...
# spring.datasource.driverClassName=org.h2.Driver

# MySQL Configuration (Uncomment these lines)
spring.datasource.url=jdbc:mysql://localhost:3306/careconnect_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 3. Database Schema Overview

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| `users` | System credentials & roles | `id`, `username`, `email`, `password` (BCrypt), `role` (`ROLE_PATIENT`, `ROLE_DOCTOR`, `ROLE_ADMIN`) |
| `patients` | Patient Demographic & Medical Profile | `id`, `mrn`, `name`, `email`, `phone`, `dob`, `blood_group`, `allergies`, `chronic_conditions` |
| `doctors` | Doctor Profiles & Availability | `id`, `name`, `email`, `phone`, `specialization`, `qualification`, `room_no`, `consultation_fee`, `status` |
| `appointments` | Booked Patient-Doctor Consultations | `id`, `appointment_number`, `patient_id`, `doctor_id`, `date_time`, `reason`, `status` |
| `medical_records` | Clinical SOAP notes & Visit records | `id`, `patient_id`, `doctor_id`, `appointment_id`, `diagnosis`, `symptoms`, `clinical_notes` |
| `prescriptions` | Doctor Prescriptions | `id`, `rx_number`, `patient_id`, `doctor_id`, `date`, `instructions` |
| `prescription_items` | Prescription Meds & Dosages | `id`, `prescription_id`, `medicine`, `dosage`, `frequency`, `duration`, `timing` |
| `diagnostic_reports` | Lab & Diagnostic test records | `id`, `report_number`, `title`, `category`, `patient_id`, `doctor_id`, `file_name`, `file_url`, `status` |
