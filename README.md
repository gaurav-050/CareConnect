# CareConnect — Patient Record Management System (PRMS)
> **Java Full-Stack College Project (Frontend + Backend Ready)**

CareConnect is a modern healthcare application built for clinics and multi-specialty hospitals. It allows medical staff and administrators to handle patient registrations, appointments, electronic medical records (EMR), and e-prescriptions.

---

## 🌟 The 7 Core Modules

| # | Module Name | Key Features |
|---|---|---|
| **1** | **User Authentication & IAM** | Registration portal for new Patients & Doctors, unified Sign-In portal, Role-Based Access Control (`ROLE_ADMIN`, `ROLE_DOCTOR`, `ROLE_PATIENT`), quick 1-click access for viva demo. |
| **2** | **Patient Management** | Patient profiles, Unique Medical Record Number (`MRN`), demographics, blood group, allergies, chronic conditions, and search. |
| **3** | **Doctor Management** | Doctor profiles, qualifications, medical specializations, consultation fees, and assigned patient rosters. |
| **4** | **Appointment Management** | Book appointments, time slot selection, lifecycle status tracking (`SCHEDULED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`). |
| **5** | **Medical Records (EMR)** | Clinical diagnoses, observed symptoms, physical findings, treatment plans, and visit histories. |
| **6** | **Prescriptions** | Create e-prescriptions with multi-drug dosage, frequency, duration, and instructions. Includes authentic printable Rx slip (`window.print()`). |
| **7** | **Admin Management** | Practice KPIs, registered user counts, doctor roster oversight, and 1-click demo database reset. |

---

## 🔐 Registration & Login Flow

1. **Register New User**: New patients or doctors register on the **Register Portal** with their details, blood group, and credentials.
2. **Auto MRN Generation**: When registered, the user is assigned a unique `PAT-2026-00X` identifier.
3. **Redirect to Sign In**: Once registered, the user is automatically transitioned to the **Sign In Portal** with their email pre-filled.
4. **Sign In to Dashboard**: Entering their password logs them directly into their tailored dashboard:
   - **Patient** &rarr; Lands on **Doctors Directory** to browse specialties and book visits.
   - **Doctor** &rarr; Lands on **Patients Directory** to view clinical charts and write prescriptions.
   - **Admin** &rarr; Lands on **Administration Dashboard** to view hospital metrics and onboard doctors.

---

## 🚀 How to Run the Project

### One-Click Launch (Windows)
- **Frontend only**: Double-click `run-frontend.bat` (opens `http://localhost:3000/`)
- **Backend only**: Double-click `run-backend.bat` (Spring Boot 3 on port 8080)
- **Full-Stack (Both)**: Double-click `run-all.bat` (launches frontend + backend simultaneously)

### Manual Terminal Commands
- **Frontend**: `jwebserver -d frontend -p 3000` &rarr; [http://localhost:3000/](http://localhost:3000/)
- **Backend**: `cd backend && .\mvnw.cmd spring-boot:run` &rarr; [http://localhost:8080/](http://localhost:8080/)
- **Swagger Docs**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **H2 DB Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
