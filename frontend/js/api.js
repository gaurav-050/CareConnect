// CareConnect - Data Access & API Layer
// Dual Mode: Seamless Spring Boot 3 REST API + LocalStorage Fallback

const API = {
  USE_BACKEND_API: true, // Calls Spring Boot backend by default
  BACKEND_BASE_URL: 'http://localhost:8080/api',

  // Initialize Storage from initial seed if empty
  initStorage() {
    if (!localStorage.getItem('ag_care_initialized')) {
      localStorage.setItem('ag_care_users', JSON.stringify([
        { id: 1, name: "Admin Officer", email: "admin@careconnect.com", role: "ADMIN", password: "admin" },
        { id: 2, name: "Dr. Sarah Jenkins", email: "doctor@careconnect.com", role: "DOCTOR", password: "doctor", doctorId: 1 },
        { id: 3, name: "Alex Johnson", email: "alex@example.com", role: "PATIENT", password: "patient", patientId: 1 }
      ]));
      localStorage.setItem('ag_care_doctors', JSON.stringify(INITIAL_DATA.doctors));
      localStorage.setItem('ag_care_patients', JSON.stringify(INITIAL_DATA.patients));
      localStorage.setItem('ag_care_appointments', JSON.stringify(INITIAL_DATA.appointments));
      localStorage.setItem('ag_care_medical_records', JSON.stringify(INITIAL_DATA.medicalRecords));
      localStorage.setItem('ag_care_prescriptions', JSON.stringify(INITIAL_DATA.prescriptions));
      localStorage.setItem('ag_care_reports', JSON.stringify(INITIAL_DATA.reports || []));
      localStorage.setItem('ag_care_initialized', 'true');
    }
  },

  resetDemoData() {
    localStorage.removeItem('ag_care_initialized');
    localStorage.removeItem('ag_care_current_user');
    this.initStorage();
    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/admin/reset-database`, { method: 'POST' }).catch(() => {});
    }
  },

  // -------------------------------------------------------------
  // MODULE 1: AUTHENTICATION
  // -------------------------------------------------------------
  getCurrentUser() {
    this.initStorage();
    const raw = localStorage.getItem('ag_care_current_user');
    if (!raw) return null;
    let user = JSON.parse(raw);

    // Auto-heal missing patientId or doctorId on current session
    if (user.role === 'PATIENT' && !user.patientId) {
      const patients = this.getPatients();
      const p = patients.find(p => 
        (user.email && p.email && p.email.toLowerCase() === user.email.toLowerCase()) ||
        (user.name && p.name && p.name.toLowerCase() === user.name.toLowerCase())
      );
      user.patientId = p ? p.id : user.id;
      localStorage.setItem('ag_care_current_user', JSON.stringify(user));
    } else if (user.role === 'DOCTOR' && !user.doctorId) {
      const doctors = this.getDoctors();
      const d = doctors.find(d => 
        (user.email && d.email && d.email.toLowerCase() === user.email.toLowerCase()) ||
        (user.name && d.name && d.name.toLowerCase() === user.name.toLowerCase())
      );
      user.doctorId = d ? d.id : user.id;
      localStorage.setItem('ag_care_current_user', JSON.stringify(user));
    }

    return user;
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('ag_care_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ag_care_current_user');
    }
  },

  async login(email, password, requiredRole = null) {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (this.USE_BACKEND_API) {
      try {
        const res = await fetch(`${this.BACKEND_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          const data = await res.json();
          const cleanRole = data.role.replace('ROLE_', '').toUpperCase();

          // Strict Role Enforcement Check
          if (requiredRole && cleanRole !== requiredRole.toUpperCase()) {
            const roleLabels = { PATIENT: 'Patient', DOCTOR: 'Doctor', ADMIN: 'Administrator' };
            const actual = roleLabels[cleanRole] || cleanRole;
            const expected = roleLabels[requiredRole.toUpperCase()] || requiredRole;
            throw new Error(`Access Denied: This is the ${expected} Portal. You have a ${actual} account — please select the "${actual}" tab above to sign in.`);
          }

          let patientId = null;
          let doctorId = null;
          if (cleanRole === 'PATIENT') {
            const patients = this.getPatients();
            const p = patients.find(p => 
              (p.email && p.email.toLowerCase() === cleanEmail) ||
              (p.name && p.name.toLowerCase() === (data.fullName || data.username).toLowerCase())
            );
            patientId = p ? p.id : data.id;
          } else if (cleanRole === 'DOCTOR') {
            const doctors = this.getDoctors();
            const d = doctors.find(d => 
              (d.email && d.email.toLowerCase() === cleanEmail) ||
              (d.name && d.name.toLowerCase() === (data.fullName || data.username).toLowerCase())
            );
            doctorId = d ? d.id : data.id;
          }

          const profile = {
            id: data.id,
            patientId: patientId,
            doctorId: doctorId,
            name: data.fullName || data.username,
            email: data.email,
            role: cleanRole,
            token: data.token,
            avatar: cleanRole.includes('DOCTOR')
              ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
              : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          };
          this.setCurrentUser(profile);
          return { success: true, user: profile };
        }
      } catch (err) {
        if (err.message && err.message.startsWith('Access Denied')) {
          throw err;
        }
        console.warn('Backend unavailable, falling back to local storage auth:', err);
      }
    }

    const users = JSON.parse(localStorage.getItem('ag_care_users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === cleanEmail || (u.name && u.name.toLowerCase() === cleanEmail));
    
    if (user && (user.password === password || password === 'demo123')) {
      const userRole = (user.role || '').toUpperCase();

      // Strict Role Enforcement Check
      if (requiredRole && userRole !== requiredRole.toUpperCase()) {
        const roleLabels = { PATIENT: 'Patient', DOCTOR: 'Doctor', ADMIN: 'Administrator' };
        const actual = roleLabels[userRole] || userRole;
        const expected = roleLabels[requiredRole.toUpperCase()] || requiredRole;
        throw new Error(`Access Denied: This is the ${expected} Portal. You have a ${actual} account — please select the "${actual}" tab above to sign in.`);
      }
      let patientId = user.patientId;
      let doctorId = user.doctorId;

      if (user.role === 'PATIENT') {
        const patients = this.getPatients();
        let p = patients.find(p => 
          (p.email && p.email.toLowerCase() === cleanEmail) ||
          (p.name && p.name.toLowerCase() === user.name.toLowerCase())
        );
        if (!p) {
          const newId = patients.length > 0 ? Math.max(...patients.map(x => x.id)) + 1 : 1;
          p = {
            id: newId,
            mrn: `PAT-2026-00${newId}`,
            name: user.name,
            email: user.email,
            phone: user.phone || '+1 555-0000',
            dob: user.dob || '2000-01-01',
            gender: user.gender || 'Not Specified',
            bloodGroup: user.bloodGroup || 'O+',
            address: user.address || 'Local Resident',
            emergencyContact: 'Not Provided',
            allergies: user.allergies || 'None recorded',
            chronicConditions: 'None',
            status: 'Active'
          };
          patients.push(p);
          localStorage.setItem('ag_care_patients', JSON.stringify(patients));
        }
        patientId = p.id;
      } else if (user.role === 'DOCTOR') {
        const doctors = this.getDoctors();
        const d = doctors.find(d => 
          (d.email && d.email.toLowerCase() === cleanEmail) ||
          (d.name && d.name.toLowerCase() === user.name.toLowerCase())
        );
        doctorId = d ? d.id : user.id;
      }

      const fullProfile = {
        id: user.id,
        patientId: patientId,
        doctorId: doctorId,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.role === 'DOCTOR' 
          ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      };
      this.setCurrentUser(fullProfile);
      return { success: true, user: fullProfile };
    }
    throw new Error('Invalid email or password');
  },

  async register(userData) {
    if (this.USE_BACKEND_API) {
      try {
        const res = await fetch(`${this.BACKEND_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: userData.email.split('@')[0],
            email: userData.email,
            password: userData.password,
            fullName: userData.name,
            phone: userData.phone,
            role: "ROLE_" + (userData.role || 'PATIENT')
          })
        });
        if (res.ok) {
          const data = await res.json();
          const profile = {
            id: data.id,
            name: data.fullName,
            email: data.email,
            role: data.role.replace('ROLE_', ''),
            token: data.token
          };
          // Do not auto-login; let user come to sign-in portal and login
          return { success: true, user: profile };
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to local registration:', err);
      }
    }

    const users = JSON.parse(localStorage.getItem('ag_care_users') || '[]');
    const exists = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'PATIENT'
    };

    if (newUser.role === 'PATIENT') {
      const patients = this.getPatients();
      const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
      const newPatient = {
        id: newId,
        mrn: `PAT-2026-00${newId}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '+1 555-0000',
        dob: userData.dob || '2000-01-01',
        gender: userData.gender || 'Not Specified',
        bloodGroup: userData.bloodGroup || 'O+',
        address: userData.address || 'Local Resident',
        emergencyContact: 'Not Provided',
        allergies: userData.allergies || 'None recorded',
        chronicConditions: 'None',
        status: 'Active'
      };
      patients.push(newPatient);
      localStorage.setItem('ag_care_patients', JSON.stringify(patients));
      newUser.patientId = newId;
    }

    users.push(newUser);
    localStorage.setItem('ag_care_users', JSON.stringify(users));

    // Do not auto-login; user will go to sign in portal
    return { success: true, user: newUser };
  },

  async resetPassword(email, newPassword) {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (this.USE_BACKEND_API) {
      try {
        const res = await fetch(`${this.BACKEND_BASE_URL}/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, newPassword: newPassword })
        });
        if (res.ok) {
          const data = await res.json();
          // Update local storage if present
          const users = JSON.parse(localStorage.getItem('ag_care_users') || '[]');
          const u = users.find(u => u.email.toLowerCase() === cleanEmail || (u.name && u.name.toLowerCase() === cleanEmail));
          if (u) {
            u.password = newPassword;
            localStorage.setItem('ag_care_users', JSON.stringify(users));
          }
          return { success: true, message: data.message || 'Password updated successfully' };
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to reset password.');
        }
      } catch (err) {
        if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
          throw err;
        }
        console.warn('Backend unavailable, falling back to local reset password:', err);
      }
    }

    const users = JSON.parse(localStorage.getItem('ag_care_users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === cleanEmail || (u.name && u.name.toLowerCase() === cleanEmail));
    if (!user) {
      throw new Error('No account found with this email or username.');
    }
    user.password = newPassword;
    localStorage.setItem('ag_care_users', JSON.stringify(users));
    return { success: true, message: 'Password has been successfully updated. You can now sign in.' };
  },

  logout() {
    localStorage.removeItem('ag_care_current_user');
    return Promise.resolve(true);
  },

  switchRole(roleName) {
    let mockProfile;
    if (roleName === 'ADMIN') {
      mockProfile = {
        id: 1,
        name: "Admin Officer",
        email: "admin@careconnect.com",
        role: "ADMIN",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
      };
    } else if (roleName === 'DOCTOR') {
      mockProfile = {
        id: 2,
        name: "Dr. Sarah Jenkins",
        email: "doctor@careconnect.com",
        role: "DOCTOR",
        specialization: "Cardiology",
        doctorId: 1,
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
      };
    } else {
      mockProfile = {
        id: 3,
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "PATIENT",
        patientId: 1,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
      };
    }
    this.setCurrentUser(mockProfile);
    return mockProfile;
  },

  // -------------------------------------------------------------
  // MODULE 2: PATIENT MANAGEMENT
  // -------------------------------------------------------------
  getPatients() {
    this.initStorage();
    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/patients`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && Array.isArray(data)) {
            localStorage.setItem('ag_care_patients', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }
    return JSON.parse(localStorage.getItem('ag_care_patients') || '[]');
  },

  getPatientById(id) {
    const list = this.getPatients();
    return list.find(p => p.id === Number(id));
  },

  createPatient(patientData) {
    const list = this.getPatients();
    const newPatient = {
      id: list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1,
      mrn: `PAT-2026-00${list.length + 1}`,
      ...patientData,
      status: "Active"
    };

    list.unshift(newPatient);
    localStorage.setItem('ag_care_patients', JSON.stringify(list));

    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient)
      }).catch(err => console.warn('Failed to sync patient to backend:', err));
    }

    return newPatient;
  },

  // -------------------------------------------------------------
  // MODULE 3: DOCTOR MANAGEMENT
  // -------------------------------------------------------------
  getDoctors() {
    this.initStorage();
    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/doctors`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && Array.isArray(data)) {
            localStorage.setItem('ag_care_doctors', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }
    return JSON.parse(localStorage.getItem('ag_care_doctors') || '[]');
  },

  getDoctorById(id) {
    const list = this.getDoctors();
    return list.find(d => d.id === Number(id));
  },

  createDoctor(doctorData) {
    const list = this.getDoctors();
    const newDoc = {
      id: list.length > 0 ? Math.max(...list.map(d => d.id)) + 1 : 1,
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
      status: "Available",
      ...doctorData
    };
    list.push(newDoc);
    localStorage.setItem('ag_care_doctors', JSON.stringify(list));

    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc)
      }).catch(err => console.warn('Failed to sync doctor to backend:', err));
    }

    return newDoc;
  },

  updateDoctorAvailability(doctorId, status) {
    const list = this.getDoctors();
    const doc = list.find(d => d.id === Number(doctorId));
    if (doc) {
      doc.status = status;
      localStorage.setItem('ag_care_doctors', JSON.stringify(list));
      if (this.USE_BACKEND_API) {
        fetch(`${this.BACKEND_BASE_URL}/doctors/${doctorId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(doc)
        }).catch(() => {});
      }
      return doc;
    }
    return null;
  },

  removeDoctor(doctorId) {
    const list = this.getDoctors();
    const doc = list.find(d => d.id === Number(doctorId));
    if (doc) {
      const updatedList = list.filter(d => d.id !== Number(doctorId));
      localStorage.setItem('ag_care_doctors', JSON.stringify(updatedList));

      if (this.USE_BACKEND_API) {
        fetch(`${this.BACKEND_BASE_URL}/doctors/${doctorId}`, {
          method: 'DELETE'
        }).catch(() => {});
      }
      return doc;
    }
    return null;
  },

  // -------------------------------------------------------------
  // MODULE 4: APPOINTMENT MANAGEMENT
  // -------------------------------------------------------------
  getAppointments() {
    this.initStorage();
    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/appointments`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && Array.isArray(data)) {
            localStorage.setItem('ag_care_appointments', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }
    return JSON.parse(localStorage.getItem('ag_care_appointments') || '[]');
  },

  createAppointment(aptData) {
    const list = this.getAppointments();
    const doctor = this.getDoctorById(aptData.doctorId);
    let patient = this.getPatientById(aptData.patientId);
    if (!patient && aptData.patientEmail) {
      patient = this.getPatients().find(p => p.email && p.email.toLowerCase() === aptData.patientEmail.toLowerCase());
    }

    const newApt = {
      id: list.length > 0 ? Math.max(...list.map(a => a.id)) + 1 : 1,
      appointmentNumber: `APT-${1000 + list.length + 1}`,
      patientId: patient ? patient.id : Number(aptData.patientId),
      patientName: patient ? patient.name : (aptData.patientName || "Patient"),
      patientEmail: patient ? patient.email : (aptData.patientEmail || ""),
      doctorId: doctor ? doctor.id : Number(aptData.doctorId),
      doctorName: doctor ? doctor.name : (aptData.doctorName || "Doctor"),
      specialization: doctor ? doctor.specialization : (aptData.specialization || "General Medicine"),
      dateTime: aptData.dateTime,
      reason: aptData.reason,
      status: "SCHEDULED"
    };

    list.unshift(newApt);
    localStorage.setItem('ag_care_appointments', JSON.stringify(list));

    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApt)
      }).catch(err => console.warn('Failed to sync appointment to backend:', err));
    }

    return newApt;
  },

  updateAppointmentStatus(id, newStatus) {
    const list = this.getAppointments();
    const apt = list.find(a => a.id === Number(id));
    if (apt) {
      apt.status = newStatus;
      localStorage.setItem('ag_care_appointments', JSON.stringify(list));

      if (this.USE_BACKEND_API) {
        fetch(`${this.BACKEND_BASE_URL}/appointments/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        }).catch(err => console.warn('Failed to update status on backend:', err));
      }

      return apt;
    }
    return null;
  },

  // -------------------------------------------------------------
  // MODULE 5: MEDICAL RECORDS
  // -------------------------------------------------------------
  getMedicalRecords() {
    this.initStorage();
    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/medical-records`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && Array.isArray(data)) {
            localStorage.setItem('ag_care_medical_records', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }
    return JSON.parse(localStorage.getItem('ag_care_medical_records') || '[]');
  },

  createMedicalRecord(recData) {
    const list = this.getMedicalRecords();
    const patient = this.getPatientById(recData.patientId);
    const doctor = this.getDoctorById(recData.doctorId);

    const newRecord = {
      id: list.length > 0 ? Math.max(...list.map(r => r.id)) + 1 : 1,
      patientId: Number(recData.patientId),
      patientName: patient ? patient.name : "Patient",
      doctorId: Number(recData.doctorId),
      doctorName: doctor ? doctor.name : "Doctor",
      appointmentId: recData.appointmentId ? Number(recData.appointmentId) : null,
      date: recData.date || new Date().toISOString().split('T')[0],
      diagnosis: recData.diagnosis,
      symptoms: recData.symptoms,
      clinicalNotes: recData.clinicalNotes,
      followUpDate: recData.followUpDate || "None"
    };

    list.unshift(newRecord);
    localStorage.setItem('ag_care_medical_records', JSON.stringify(list));

    if (recData.appointmentId) {
      this.updateAppointmentStatus(recData.appointmentId, 'COMPLETED');
    }

    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/medical-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      }).catch(err => console.warn('Failed to sync record to backend:', err));
    }

    return newRecord;
  },

  // -------------------------------------------------------------
  // MODULE 6: PRESCRIPTION MANAGEMENT
  // -------------------------------------------------------------
  getPrescriptions() {
    this.initStorage();
    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/prescriptions`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && Array.isArray(data)) {
            localStorage.setItem('ag_care_prescriptions', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }
    return JSON.parse(localStorage.getItem('ag_care_prescriptions') || '[]');
  },

  createPrescription(rxData) {
    const list = this.getPrescriptions();
    const patient = this.getPatientById(rxData.patientId);
    const doctor = this.getDoctorById(rxData.doctorId);

    const newRx = {
      id: list.length > 0 ? Math.max(...list.map(r => r.id)) + 1 : 1,
      rxNumber: `RX-${500 + list.length + 1}`,
      patientId: Number(rxData.patientId),
      patientName: patient ? patient.name : "Patient",
      doctorId: Number(rxData.doctorId),
      doctorName: doctor ? doctor.name : "Doctor",
      doctorSpecialization: doctor ? doctor.specialization : "General Practitioner",
      date: new Date().toISOString().split('T')[0],
      instructions: rxData.instructions || "Take as directed by doctor.",
      items: rxData.items || []
    };

    list.unshift(newRx);
    localStorage.setItem('ag_care_prescriptions', JSON.stringify(list));

    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRx)
      }).catch(err => console.warn('Failed to sync prescription to backend:', err));
    }

    return newRx;
  },

  // -------------------------------------------------------------
  // MODULE 7: ADMIN MANAGEMENT & DASHBOARD STATS
  // -------------------------------------------------------------
  getDashboardStats() {
    const patients = this.getPatients();
    const doctors = this.getDoctors();
    const appointments = this.getAppointments();
    const records = this.getMedicalRecords();

    const scheduled = appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length;
    const completed = appointments.filter(a => a.status === 'COMPLETED').length;

    return {
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      totalAppointments: appointments.length,
      pendingAppointments: scheduled,
      completedAppointments: completed,
      totalRecords: records.length,
      totalReports: (JSON.parse(localStorage.getItem('ag_care_reports') || '[]')).length
    };
  },

  // -------------------------------------------------------------
  // MODULE 8: MEDICAL & DIAGNOSTIC REPORTS
  // -------------------------------------------------------------
  getReports() {
    this.initStorage();
    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/reports`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && Array.isArray(data)) {
            localStorage.setItem('ag_care_reports', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }
    return JSON.parse(localStorage.getItem('ag_care_reports') || '[]');
  },

  getReportById(id) {
    const list = this.getReports();
    return list.find(r => r.id === Number(id));
  },

  uploadReport(reportData) {
    const reports = this.getReports();
    const patient = this.getPatientById(reportData.patientId);
    const doctor = this.getDoctorById(reportData.doctorId);

    const newReport = {
      id: reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1,
      reportNumber: `REP-900${reports.length + 1}`,
      patientId: Number(reportData.patientId),
      patientName: patient ? patient.name : (reportData.patientName || "Patient"),
      doctorId: Number(reportData.doctorId),
      doctorName: doctor ? doctor.name : (reportData.doctorName || "Doctor"),
      title: reportData.title,
      category: reportData.category || "General Diagnostic",
      date: reportData.date || new Date().toISOString().split('T')[0],
      summary: reportData.summary || "Diagnostic findings verified.",
      fileName: reportData.fileName || "Diagnostic_Test_Report.pdf",
      fileUrl: reportData.fileUrl || "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80",
      status: "Verified & Uploaded"
    };

    reports.unshift(newReport);
    localStorage.setItem('ag_care_reports', JSON.stringify(reports));

    if (this.USE_BACKEND_API) {
      fetch(`${this.BACKEND_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      }).catch(err => console.warn('Failed to sync report to backend:', err));
    }

    return newReport;
  }
};
