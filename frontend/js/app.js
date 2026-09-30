// CareConnect - Main Application Controller & UI Logic

// State
let currentTab = 'doctors'; // Default tab will be set by role
let activeUser = null;
let selectedLoginRole = 'PATIENT';

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  API.initStorage();
  checkAuthState();
  setupLoginForm();
});

// Toast notification helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white';
  const icon = type === 'success' ? '✓' : '⚠';

  toast.className = `flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${bg} text-sm font-medium toast-animate transition-all`;
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// -------------------------------------------------------------
// AUTHENTICATION & LOGIN SCREEN LOGIC
// -------------------------------------------------------------
function checkAuthState() {
  activeUser = API.getCurrentUser();
  const viewLogin = document.getElementById('view-login');
  const viewApp = document.getElementById('view-app');

  if (!activeUser) {
    if (viewLogin) viewLogin.classList.remove('hidden');
    if (viewApp) viewApp.classList.add('hidden');
    // Start on the Registration Portal by default as requested
    toggleAuthMode('register');
    selectLoginPortal('PATIENT');
  } else {
    if (viewLogin) viewLogin.classList.add('hidden');
    if (viewApp) viewApp.classList.remove('hidden');
    setupPortalForRole(activeUser.role);
    setupEventListeners();
  }
}

// Tab switcher on Login Screen
function selectLoginPortal(role) {
  selectedLoginRole = role;
  const tabPatient = document.getElementById('tabLoginPatient');
  const tabDoctor = document.getElementById('tabLoginDoctor');
  const tabAdmin = document.getElementById('tabLoginAdmin');
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const titleEl = document.getElementById('loginBannerTitle');
  const descEl = document.getElementById('loginBannerDesc');

  [tabPatient, tabDoctor, tabAdmin].forEach(t => {
    if (t) {
      t.className = 'login-role-tab py-2 rounded-xl transition text-slate-500 hover:text-slate-800';
    }
  });

  if (role === 'PATIENT') {
    if (tabPatient) tabPatient.className = 'login-role-tab py-2 rounded-xl transition bg-white text-teal-800 shadow-xs';
    if (emailInput && !emailInput.value) emailInput.placeholder = 'e.g. alex@example.com';
    if (titleEl) titleEl.textContent = 'Patient Portal';
    if (descEl) descEl.textContent = 'Browse specialist doctors, view qualifications & fees, and book visits.';
  } else if (role === 'DOCTOR') {
    if (tabDoctor) tabDoctor.className = 'login-role-tab py-2 rounded-xl transition bg-white text-teal-800 shadow-xs';
    if (emailInput && !emailInput.value) emailInput.placeholder = 'e.g. doctor@careconnect.com';
    if (titleEl) titleEl.textContent = 'Doctor Portal';
    if (descEl) descEl.textContent = 'Access patient health charts, medical history, conduct consultations, and write e-prescriptions.';
  } else {
    if (tabAdmin) tabAdmin.className = 'login-role-tab py-2 rounded-xl transition bg-white text-teal-800 shadow-xs';
    if (emailInput && !emailInput.value) emailInput.placeholder = 'e.g. admin@careconnect.com';
    if (titleEl) titleEl.textContent = 'Administrator Portal';
    if (descEl) descEl.textContent = 'Hospital management oversight, onboard doctors, manage patients, and practice analytics.';
  }
}

// Toggle between Sign In and Register Mode
function toggleAuthMode(mode) {
  const loginSection = document.getElementById('authModeLogin');
  const registerSection = document.getElementById('authModeRegister');
  const btnSignIn = document.getElementById('btnToggleSignIn');
  const btnRegister = document.getElementById('btnToggleRegister');

  if (mode === 'register') {
    if (loginSection) loginSection.classList.add('hidden');
    if (registerSection) registerSection.classList.remove('hidden');
    if (btnSignIn) {
      btnSignIn.className = 'flex-1 pb-2.5 text-center border-b-2 border-transparent text-slate-400 hover:text-slate-700 transition';
    }
    if (btnRegister) {
      btnRegister.className = 'flex-1 pb-2.5 text-center border-b-2 border-teal-600 text-teal-800 transition';
    }
  } else {
    if (loginSection) loginSection.classList.remove('hidden');
    if (registerSection) registerSection.classList.add('hidden');
    if (btnSignIn) {
      btnSignIn.className = 'flex-1 pb-2.5 text-center border-b-2 border-teal-600 text-teal-800 transition';
    }
    if (btnRegister) {
      btnRegister.className = 'flex-1 pb-2.5 text-center border-b-2 border-transparent text-slate-400 hover:text-slate-700 transition';
    }
  }
}

// Toggle Patient vs Doctor registration specific input fields
function toggleRegFields(role) {
  const patFields = document.getElementById('regPatientFields');
  const docFields = document.getElementById('regDoctorFields');
  if (role === 'DOCTOR') {
    if (patFields) patFields.classList.add('hidden');
    if (docFields) docFields.classList.remove('hidden');
  } else {
    if (patFields) patFields.classList.remove('hidden');
    if (docFields) docFields.classList.add('hidden');
  }
}

// Handle Login Form Submit
function setupLoginForm() {
  const formLogin = document.getElementById('formLogin');
  if (formLogin && !formLogin.dataset.bound) {
    formLogin.dataset.bound = "true";
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      try {
        const res = await API.login(email, password);
        showToast(`Welcome, ${res.user.name}!`, 'success');
        checkAuthState();
      } catch (err) {
        showToast(err.message || 'Login failed. Please check credentials.', 'error');
      }
    });
  }

  // Handle Registration Form Submit
  const formRegister = document.getElementById('formRegister');
  if (formRegister && !formRegister.dataset.bound) {
    formRegister.dataset.bound = "true";
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      const role = document.querySelector('input[name="regRole"]:checked')?.value || 'PATIENT';
      const fullName = document.getElementById('regFullName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('regPasswordConfirm').value;

      if (password !== confirmPassword) {
        showToast('Passwords do not match! Please check again.', 'error');
        return;
      }

      if (password.length < 4) {
        showToast('Password should be at least 4 characters.', 'error');
        return;
      }

      const userData = {
        name: fullName,
        email: email,
        phone: phone,
        password: password,
        role: role
      };

      if (role === 'PATIENT') {
        userData.dob = document.getElementById('regDob')?.value || '2000-01-01';
        userData.gender = document.getElementById('regGender')?.value || 'Not Specified';
        userData.bloodGroup = document.getElementById('regBloodGroup')?.value || 'O+';
        userData.allergies = document.getElementById('regAllergies')?.value || 'None recorded';
      } else {
        // Registering as Doctor
        userData.specialization = document.getElementById('regDocSpecialization')?.value || 'General Medicine';
        userData.qualification = document.getElementById('regDocQualification')?.value || 'MBBS';
        userData.department = document.getElementById('regDocDepartment')?.value || 'Outpatient Clinic';
        userData.consultationFee = Number(document.getElementById('regDocFee')?.value) || 50;

        // Also add to Doctors list
        API.createDoctor({
          name: fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`,
          email: email,
          phone: phone,
          specialization: userData.specialization,
          qualification: userData.qualification,
          department: userData.department,
          consultationFee: userData.consultationFee,
          experience: '5 Years',
          roomNo: 'Room 101'
        });
      }

      try {
        const res = await API.register(userData);
        formRegister.reset();
        showToast(`Account registered successfully! Please sign in with your credentials to enter CareConnect.`, 'success');

        // Switch to Sign In portal and pre-fill email
        toggleAuthMode('login');
        selectLoginPortal(role);

        const emailField = document.getElementById('loginEmail');
        if (emailField) emailField.value = email;

        const passField = document.getElementById('loginPassword');
        if (passField) {
          passField.value = '';
          passField.focus();
        }
      } catch (err) {
        showToast(err.message || 'Registration failed.', 'error');
      }
    });
  }
}

// Handle Logout
function handleLogout() {
  API.logout();
  showToast('You have been signed out.', 'success');
  checkAuthState();
}

// -------------------------------------------------------------
// ROLE-TAILORED PORTAL SETUP
// -------------------------------------------------------------
function setupPortalForRole(role) {
  const nameEl = document.getElementById('currentUserName');
  const roleEl = document.getElementById('currentUserRole');
  const avatarEl = document.getElementById('currentUserAvatar');
  const badgeEl = document.getElementById('headerPortalBadge');
  const subEl = document.getElementById('headerPortalSubtitle');
  const navContainer = document.getElementById('sidebarNav');
  const actionCard = document.getElementById('sidebarActionCard');

  if (nameEl) nameEl.textContent = activeUser.name;
  if (roleEl) roleEl.textContent = activeUser.role;
  if (avatarEl) avatarEl.src = activeUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  const btnOnboardDoc = document.getElementById('btnOnboardDoctorAdmin');
  const btnNewRecord = document.getElementById('btnNewRecordDoc');
  const btnNewRx = document.getElementById('btnNewPrescriptionDoc');
  const btnUploadReport = document.getElementById('btnUploadReportHeader');

  if (role === 'PATIENT') {
    if (badgeEl) {
      badgeEl.textContent = 'Patient Portal';
      badgeEl.className = 'px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-teal-100 text-teal-800';
    }
    if (subEl) subEl.textContent = 'Doctor directory, appointments & diagnostic reports';

    if (btnOnboardDoc) btnOnboardDoc.classList.add('hidden');
    if (btnNewRecord) btnNewRecord.classList.add('hidden');
    if (btnNewRx) btnNewRx.classList.add('hidden');
    if (btnUploadReport) btnUploadReport.classList.add('hidden');

    if (navContainer) {
      navContainer.innerHTML = `
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-teal-50 text-teal-700 font-semibold transition" data-tab="doctors">
          <span class="text-lg">🩺</span>
          <span>Doctors Details</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="appointments">
          <span class="text-lg">📅</span>
          <span>My Appointments</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="reports">
          <span class="text-lg">📑</span>
          <span>My Diagnostic Reports</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="prescriptions">
          <span class="text-lg">💊</span>
          <span>My Prescriptions</span>
        </a>
      `;
    }

    if (actionCard) {
      actionCard.innerHTML = `
        <div class="font-bold text-sm mb-1">Patient Quick Actions</div>
        <p class="text-teal-200 mb-3">Schedule consultations or view verified test results.</p>
        <div class="space-y-2">
          <button onclick="openBookAppointmentModal()" class="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-3 rounded-xl transition text-center shadow-xs">
            + Book Appointment
          </button>
          <button onclick="switchTab('reports')" class="w-full bg-teal-800 hover:bg-teal-700 text-teal-100 font-semibold py-2 px-3 rounded-xl transition text-center">
            📑 View Diagnostic Reports
          </button>
        </div>
      `;
    }

    switchTab('doctors');

  } else if (role === 'DOCTOR') {
    if (badgeEl) {
      badgeEl.textContent = 'Doctor Portal';
      badgeEl.className = 'px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-sky-100 text-sky-800';
    }
    if (subEl) subEl.textContent = 'Patient health charts, clinical notes & diagnostic uploads';

    if (btnOnboardDoc) btnOnboardDoc.classList.add('hidden');
    if (btnNewRecord) btnNewRecord.classList.remove('hidden');
    if (btnNewRx) btnNewRx.classList.remove('hidden');
    if (btnUploadReport) btnUploadReport.classList.remove('hidden');

    if (navContainer) {
      navContainer.innerHTML = `
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-teal-50 text-teal-700 font-semibold transition" data-tab="patients">
          <span class="text-lg">👥</span>
          <span>Patients Details</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="appointments">
          <span class="text-lg">📅</span>
          <span>My Consultation Queue</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="records">
          <span class="text-lg">📋</span>
          <span>Clinical Records</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="reports">
          <span class="text-lg">📑</span>
          <span>Diagnostic Reports</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="prescriptions">
          <span class="text-lg">💊</span>
          <span>Issued Prescriptions</span>
        </a>
      `;
    }

    if (actionCard) {
      actionCard.innerHTML = `
        <div class="font-bold text-sm mb-1">Clinical Actions</div>
        <p class="text-teal-200 mb-3">Record examination findings, upload reports, or issue prescriptions.</p>
        <div class="space-y-2">
          <button onclick="openUploadReportModal()" class="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-3 rounded-xl transition text-center shadow-xs">
            + Upload Patient Report
          </button>
          <button onclick="openMedicalRecordModal()" class="w-full bg-teal-800 hover:bg-teal-700 text-teal-100 font-semibold py-2 px-3 rounded-xl transition text-center">
            + Clinical Note
          </button>
          <button onclick="openCreatePrescriptionModal()" class="w-full bg-teal-900/60 hover:bg-teal-800 text-teal-200 font-medium py-1.5 px-3 rounded-xl transition text-center text-xs">
            + Write Prescription
          </button>
        </div>
      `;
    }

    switchTab('patients');

  } else {
    // ADMIN ROLE
    if (badgeEl) {
      badgeEl.textContent = 'Administrator Portal';
      badgeEl.className = 'px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-purple-100 text-purple-800';
    }
    if (subEl) subEl.textContent = 'Hospital oversight, doctor availability & diagnostics';

    if (btnOnboardDoc) btnOnboardDoc.classList.remove('hidden');
    if (btnNewRecord) btnNewRecord.classList.remove('hidden');
    if (btnNewRx) btnNewRx.classList.remove('hidden');
    if (btnUploadReport) btnUploadReport.classList.remove('hidden');

    if (navContainer) {
      navContainer.innerHTML = `
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-teal-50 text-teal-700 font-semibold transition" data-tab="admin">
          <span class="text-lg">📊</span>
          <span>Administration Details</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="doctors">
          <span class="text-lg">🩺</span>
          <span>Manage Doctors (Availability)</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="patients">
          <span class="text-lg">👥</span>
          <span>Manage Patients</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="appointments">
          <span class="text-lg">📅</span>
          <span>All Appointments</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="reports">
          <span class="text-lg">📑</span>
          <span>Diagnostic Reports</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="records">
          <span class="text-lg">📋</span>
          <span>Medical Records</span>
        </a>
        <a href="#" class="nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition" data-tab="prescriptions">
          <span class="text-lg">💊</span>
          <span>Prescriptions</span>
        </a>
      `;
    }

    if (actionCard) {
      actionCard.innerHTML = `
        <div class="font-bold text-sm mb-1">Administrative Controls</div>
        <p class="text-teal-200 mb-3">Onboard medical personnel, manage shifts, and review diagnostics.</p>
        <div class="space-y-2">
          <button onclick="openModal('modalAddDoctor')" class="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-3 rounded-xl transition text-center shadow-xs">
            + Onboard Doctor
          </button>
          <button onclick="openUploadReportModal()" class="w-full bg-teal-800 hover:bg-teal-700 text-teal-100 font-semibold py-2 px-3 rounded-xl transition text-center">
            + Upload Report
          </button>
          <button onclick="openModal('modalAddPatient')" class="w-full bg-teal-900/60 hover:bg-teal-800 text-teal-200 font-medium py-1.5 px-3 rounded-xl transition text-center text-xs">
            + Register Patient
          </button>
        </div>
      `;
    }

    switchTab('admin');
  }

  // Setup sidebar navigation click events
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.getAttribute('data-tab');
      switchTab(tab);
    });
  });
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-tab') === tab) {
      link.classList.add('bg-teal-50', 'text-teal-700', 'font-semibold');
      link.classList.remove('text-slate-600', 'hover:bg-slate-50');
    } else {
      link.classList.remove('bg-teal-50', 'text-teal-700', 'font-semibold');
      link.classList.add('text-slate-600', 'hover:bg-slate-50');
    }
  });

  // Hide all sections, show active
  document.querySelectorAll('.tab-content').forEach(sec => sec.classList.add('hidden'));
  const activeSection = document.getElementById(`section-${tab}`);
  if (activeSection) {
    activeSection.classList.remove('hidden');
  }

  renderCurrentTab();
}

function renderCurrentTab() {
  switch (currentTab) {
    case 'doctors':
      renderDoctors();
      break;
    case 'patients':
      renderPatients();
      break;
    case 'admin':
      renderAdminPanel();
      break;
    case 'appointments':
      renderAppointments();
      break;
    case 'records':
      renderMedicalRecords();
      break;
    case 'prescriptions':
      renderPrescriptions();
      break;
    case 'reports':
      renderReports();
      break;
  }
}

// -------------------------------------------------------------
// MODULE: DOCTORS DIRECTORY (Primary for PATIENT)
// -------------------------------------------------------------
function renderDoctors() {
  const doctors = API.getDoctors();
  const grid = document.getElementById('doctorsGrid');
  const specFilter = document.getElementById('doctorSpecFilter');
  const selectedSpec = specFilter?.value || 'ALL';

  if (!grid) return;

  const filtered = selectedSpec === 'ALL' 
    ? doctors 
    : doctors.filter(d => d.specialization.toLowerCase() === selectedSpec.toLowerCase());

  grid.innerHTML = filtered.map(d => {
    let statusBg = 'bg-emerald-100 text-emerald-800';
    if (d.status === 'In Consultation') statusBg = 'bg-sky-100 text-sky-800';
    else if (d.status === 'On Leave') statusBg = 'bg-amber-100 text-amber-800';
    else if (d.status === 'Off Duty') statusBg = 'bg-slate-200 text-slate-700';

    const isAvail = d.status === 'Available';

    return `
      <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition">
        <div class="flex items-start gap-4 mb-4">
          <img src="${d.avatar}" alt="${d.name}" class="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm" />
          <div class="flex-1 min-w-0">
            <span class="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${statusBg} mb-1">
              ${d.status}
            </span>
            <h3 class="font-bold text-slate-900 text-base truncate">${d.name}</h3>
            <p class="text-teal-600 text-xs font-semibold">${d.specialization}</p>
            <p class="text-slate-400 text-xs">${d.qualification}</p>
          </div>
        </div>

        <div class="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3 mb-4">
          <div class="flex justify-between">
            <span class="text-slate-400">Department:</span>
            <span class="font-medium text-slate-800">${d.department}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Experience:</span>
            <span class="font-medium text-slate-800">${d.experience}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Consultation Fee:</span>
            <span class="font-bold text-teal-700">$${d.consultationFee}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Location:</span>
            <span class="font-medium text-slate-800">${d.roomNo}</span>
          </div>
        </div>

        ${activeUser?.role === 'ADMIN' ? `
          <div class="mb-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl">
            <span class="text-[11px] font-bold text-slate-700">Set Availability:</span>
            <div class="flex items-center gap-1.5">
              <select onchange="changeDoctorAvailability(${d.id}, this.value)" class="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-300 bg-white text-slate-800 shadow-2xs focus:ring-1 focus:ring-teal-500">
                <option value="Available" ${d.status === 'Available' ? 'selected' : ''}>🟢 Available</option>
                <option value="In Consultation" ${d.status === 'In Consultation' ? 'selected' : ''}>🔵 In Consultation</option>
                <option value="On Leave" ${d.status === 'On Leave' ? 'selected' : ''}>🟠 On Leave</option>
                <option value="Off Duty" ${d.status === 'Off Duty' ? 'selected' : ''}>⚪ Off Duty</option>
              </select>
              <button onclick="confirmRemoveDoctor(${d.id}, '${d.name.replace(/'/g, "\\'")}')" class="text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2 py-1 rounded-lg font-bold transition flex items-center gap-1 shadow-2xs" title="Remove doctor from availability list">
                <span>🗑️</span> <span>Remove</span>
              </button>
            </div>
          </div>
        ` : ''}

        <div class="grid grid-cols-2 gap-2">
          <button onclick="${d.status === 'On Leave' || d.status === 'Off Duty' ? `showToast('${d.name} is currently ${d.status}. Booking for their next clinic date.', 'info'); openBookAppointmentForDoctor(${d.id});` : `openBookAppointmentForDoctor(${d.id})`}" class="text-xs ${isAvail ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'} font-semibold py-2 rounded-xl transition text-center shadow-xs">
            ${isAvail ? 'Book Visit' : `Book (${d.status})`}
          </button>
          <button onclick="viewDoctorPatients(${d.id})" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl transition text-center">
            Assigned Patients
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function viewDoctorPatients(doctorId) {
  const doctor = API.getDoctorById(doctorId);
  if (!doctor) return;

  const appointments = API.getAppointments().filter(a => a.doctorId === doctor.id);
  const patientIds = [...new Set(appointments.map(a => a.patientId))];
  const allPatients = API.getPatients();
  const assigned = allPatients.filter(p => patientIds.includes(p.id));

  const modalBody = document.getElementById('doctorPatientsModalBody');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="mb-4">
      <h3 class="text-lg font-bold text-slate-900">${doctor.name} — Patient Roster</h3>
      <p class="text-xs text-slate-500">${doctor.specialization} • ${assigned.length} Patients have consulted with this doctor</p>
    </div>

    <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
      ${assigned.length === 0 ? '<p class="text-sm text-slate-400 italic">No patients assigned yet.</p>' : assigned.map(p => `
        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <div class="font-semibold text-slate-900 text-sm">${p.name} <span class="text-xs font-mono text-slate-400">(${p.mrn})</span></div>
            <div class="text-xs text-slate-500">Phone: ${p.phone} • Blood: <span class="text-rose-600 font-bold">${p.bloodGroup}</span></div>
          </div>
          <button onclick="closeModal('modalDoctorPatients'); viewPatientProfile(${p.id})" class="text-xs bg-teal-100 hover:bg-teal-200 text-teal-800 font-medium px-3 py-1.5 rounded-lg transition">
            Profile
          </button>
        </div>
      `).join('')}
    </div>
  `;

  openModal('modalDoctorPatients');
}

// -------------------------------------------------------------
// MODULE: PATIENTS DIRECTORY (Primary for DOCTOR)
// -------------------------------------------------------------
function renderPatients() {
  const patients = API.getPatients();
  const tbody = document.getElementById('patientsTableBody');
  const searchInput = document.getElementById('patientSearchInput');
  const query = (searchInput?.value || '').toLowerCase();

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.mrn.toLowerCase().includes(query) ||
    p.phone.includes(query) ||
    p.bloodGroup.toLowerCase().includes(query)
  );

  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">No patient records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
      <td class="py-3 px-4">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 font-mono">
          ${p.mrn}
        </span>
      </td>
      <td class="py-3 px-4">
        <div class="font-semibold text-slate-900">${p.name}</div>
        <div class="text-xs text-slate-400">${p.email}</div>
      </td>
      <td class="py-3 px-4 text-slate-600">${p.gender}, ${calculateAge(p.dob)} yrs</td>
      <td class="py-3 px-4">
        <span class="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          ${p.bloodGroup}
        </span>
      </td>
      <td class="py-3 px-4 text-slate-600 text-sm">${p.phone}</td>
      <td class="py-3 px-4">
        <span class="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">${p.allergies}</span>
      </td>
      <td class="py-3 px-4 text-right space-x-1.5">
        <button onclick="viewPatientProfile(${p.id})" class="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg font-semibold transition">
          View Profile
        </button>
        ${activeUser?.role !== 'PATIENT' ? `
          <button onclick="openUploadReportModalForPatient(${p.id})" class="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 px-2.5 py-1.5 rounded-lg font-semibold transition" title="Upload Diagnostic Report">
            + Report
          </button>
        ` : ''}
        <button onclick="openBookAppointmentForPatient(${p.id})" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg font-medium transition">
          Book Apt
        </button>
      </td>
    </tr>
  `).join('');
}

function viewPatientProfile(patientId) {
  const p = API.getPatientById(patientId);
  if (!p) return;

  const records = API.getMedicalRecords().filter(r => r.patientId === p.id);
  const prescriptions = API.getPrescriptions().filter(rx => rx.patientId === p.id);
  const reports = API.getReports().filter(rep => rep.patientId === p.id);

  const modalBody = document.getElementById('patientProfileModalBody');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between border-b pb-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl font-bold">
            ${p.name.charAt(0)}
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-900">${p.name}</h3>
            <p class="text-sm text-slate-500 font-mono">${p.mrn} • ${p.gender} • ${calculateAge(p.dob)} Years old</p>
          </div>
        </div>
        <div class="text-right">
          <span class="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full border border-emerald-200">
            ${p.status}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div class="text-xs text-slate-400 font-medium">Blood Group</div>
          <div class="text-lg font-bold text-rose-600">${p.bloodGroup}</div>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div class="text-xs text-slate-400 font-medium">Date of Birth</div>
          <div class="text-sm font-semibold text-slate-700">${p.dob}</div>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div class="text-xs text-slate-400 font-medium">Phone Number</div>
          <div class="text-sm font-semibold text-slate-700">${p.phone}</div>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div class="text-xs text-slate-400 font-medium">Emergency Contact</div>
          <div class="text-sm font-semibold text-slate-700">${p.emergencyContact}</div>
        </div>
      </div>

      <div class="bg-amber-50/70 border border-amber-200/70 p-4 rounded-xl text-sm">
        <div class="font-semibold text-amber-900 flex items-center gap-1.5 mb-1">
          <span>⚠️</span> Medical Alert / Allergies:
        </div>
        <p class="text-amber-800">${p.allergies} | Chronic: ${p.chronicConditions}</p>
        <p class="text-xs text-amber-700 mt-1">Residential Address: ${p.address}</p>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-bold text-slate-800 text-base">Diagnostic & Lab Reports (${reports.length})</h4>
          ${activeUser?.role !== 'PATIENT' ? `
            <button onclick="closeModal('modalPatientProfile'); openUploadReportModalForPatient(${p.id})" class="text-xs font-semibold text-teal-700 hover:text-teal-800">
              + Upload Report
            </button>
          ` : ''}
        </div>
        <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
          ${reports.length === 0 ? '<p class="text-sm text-slate-400 italic">No diagnostic reports uploaded yet.</p>' : reports.map(rep => `
            <div class="flex items-center justify-between p-3 bg-sky-50/60 border border-sky-100 rounded-xl">
              <div>
                <span class="font-mono text-xs font-bold text-sky-800">${rep.reportNumber}</span>
                <span class="text-xs font-bold text-slate-900 ml-2">${rep.title}</span>
                <div class="text-xs text-slate-500">${rep.category} • by ${rep.doctorName} on ${rep.date}</div>
              </div>
              <button onclick="closeModal('modalPatientProfile'); viewReportDetails(${rep.id})" class="text-xs bg-sky-600 hover:bg-sky-700 text-white font-medium px-3 py-1.5 rounded-lg transition">
                View Report
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 text-base mb-3">Clinical Visit History (${records.length})</h4>
        <div class="space-y-3 max-h-56 overflow-y-auto pr-1">
          ${records.length === 0 ? '<p class="text-sm text-slate-400 italic">No past clinical visits recorded.</p>' : records.map(r => `
            <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div class="flex justify-between items-start mb-1">
                <span class="font-bold text-slate-900 text-sm">${r.diagnosis}</span>
                <span class="text-xs text-slate-400">${r.date}</span>
              </div>
              <p class="text-xs text-slate-600 mb-1"><strong>Doctor:</strong> ${r.doctorName}</p>
              <p class="text-xs text-slate-500 leading-relaxed">${r.clinicalNotes}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 text-base mb-3">Issued Prescriptions (${prescriptions.length})</h4>
        <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
          ${prescriptions.length === 0 ? '<p class="text-sm text-slate-400 italic">No prescriptions issued yet.</p>' : prescriptions.map(rx => `
            <div class="flex items-center justify-between p-3 bg-teal-50/50 border border-teal-100 rounded-xl">
              <div>
                <span class="font-mono text-xs font-bold text-teal-800">${rx.rxNumber}</span>
                <span class="text-xs text-slate-500 ml-2">by ${rx.doctorName} on ${rx.date}</span>
                <div class="text-xs text-slate-700 font-medium mt-0.5">${rx.items.map(i => i.medicine).join(', ')}</div>
              </div>
              <button onclick="viewPrescriptionSlip(${rx.id})" class="text-xs bg-teal-600 hover:bg-teal-700 text-white font-medium px-3 py-1.5 rounded-lg transition">
                View & Print Rx
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  openModal('modalPatientProfile');
}

// -------------------------------------------------------------
// MODULE: ADMIN DASHBOARD (Primary for ADMIN)
// -------------------------------------------------------------
function renderAdminPanel() {
  const stats = API.getDashboardStats();
  const doctors = API.getDoctors();

  const totalPatEl = document.getElementById('statTotalPatients');
  const totalDocEl = document.getElementById('statTotalDoctors');
  const totalAptEl = document.getElementById('statTotalAppointments');
  const pendingAptEl = document.getElementById('statPendingAppointments');

  if (totalPatEl) totalPatEl.textContent = stats.totalPatients;
  if (totalDocEl) totalDocEl.textContent = stats.totalDoctors;
  if (totalAptEl) totalAptEl.textContent = stats.totalAppointments;
  if (pendingAptEl) pendingAptEl.textContent = stats.pendingAppointments;

  const adminDocsList = document.getElementById('adminDoctorsList');
  if (adminDocsList) {
    adminDocsList.innerHTML = doctors.map(d => `
      <div class="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 gap-3">
        <div>
          <div class="font-bold text-slate-900 text-sm">${d.name}</div>
          <div class="text-xs text-slate-500">${d.specialization} • ${d.roomNo} • Fee: $${d.consultationFee}</div>
        </div>
        <div class="flex items-center gap-2">
          <select onchange="changeDoctorAvailability(${d.id}, this.value)" class="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 shadow-2xs focus:ring-1 focus:ring-teal-500">
            <option value="Available" ${d.status === 'Available' ? 'selected' : ''}>🟢 Available</option>
            <option value="In Consultation" ${d.status === 'In Consultation' ? 'selected' : ''}>🔵 In Consultation</option>
            <option value="On Leave" ${d.status === 'On Leave' ? 'selected' : ''}>🟠 On Leave</option>
            <option value="Off Duty" ${d.status === 'Off Duty' ? 'selected' : ''}>⚪ Off Duty</option>
          </select>
          <button onclick="confirmRemoveDoctor(${d.id}, '${d.name.replace(/'/g, "\\'")}')" class="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 shadow-2xs" title="Remove doctor from availability list">
            <span>🗑️</span> <span>Remove</span>
          </button>
        </div>
      </div>
    `).join('');
  }
}

function changeDoctorAvailability(doctorId, newStatus) {
  const doc = API.updateDoctorAvailability(doctorId, newStatus);
  if (doc) {
    showToast(`${doc.name} availability updated to "${newStatus}"`, 'success');
    if (currentTab === 'doctors') renderDoctors();
    if (currentTab === 'admin') renderAdminPanel();
  }
}

function confirmRemoveDoctor(doctorId, doctorName) {
  if (activeUser?.role !== 'ADMIN') {
    showToast('Only administrators have authority to remove doctors.', 'error');
    return;
  }

  const ok = confirm(`Are you sure you want to remove ${doctorName} from the doctor availability list?\n\nThis doctor will be removed from clinic rosters and patients will no longer be able to book visits with them.`);
  if (!ok) return;

  const removed = API.removeDoctor(doctorId);
  if (removed) {
    showToast(`${removed.name} has been removed from the availability list.`, 'success');
    if (currentTab === 'doctors') renderDoctors();
    if (currentTab === 'admin') renderAdminPanel();
    populateDropdowns();
  }
}

// -------------------------------------------------------------
// MODULE: APPOINTMENTS
// -------------------------------------------------------------
function renderAppointments() {
  const allAppointments = API.getAppointments();
  const tbody = document.getElementById('appointmentsTableBody');
  const filter = document.getElementById('appointmentStatusFilter')?.value || 'ALL';

  if (!tbody) return;

  // Filter based on active role
  let appointments = allAppointments;
  if (activeUser?.role === 'PATIENT') {
    appointments = allAppointments.filter(a => a.patientId === (activeUser.patientId || 1));
  } else if (activeUser?.role === 'DOCTOR') {
    appointments = allAppointments.filter(a => a.doctorId === (activeUser.doctorId || 1));
  }

  const filtered = filter === 'ALL'
    ? appointments
    : appointments.filter(a => a.status === filter);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-400">No appointments found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(a => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
      <td class="py-3 px-4 font-mono text-xs font-bold text-slate-700">${a.appointmentNumber}</td>
      <td class="py-3 px-4">
        <div class="font-semibold text-slate-900">${a.patientName}</div>
        <div class="text-xs text-slate-400">${a.reason}</div>
      </td>
      <td class="py-3 px-4">
        <div class="text-sm font-medium text-slate-800">${a.doctorName}</div>
        <div class="text-xs text-teal-600 font-medium">${a.specialization}</div>
      </td>
      <td class="py-3 px-4 text-xs text-slate-600 font-medium">${formatDateTime(a.dateTime)}</td>
      <td class="py-3 px-4">${getStatusBadge(a.status)}</td>
      <td class="py-3 px-4 text-right space-x-1.5">
        ${a.status !== 'COMPLETED' && a.status !== 'CANCELLED' ? `
          <button onclick="changeAppointmentStatus(${a.id}, 'COMPLETED')" class="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1.5 rounded-lg font-semibold transition" title="Mark as Completed">
            Complete
          </button>
          <button onclick="changeAppointmentStatus(${a.id}, 'CANCELLED')" class="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1.5 rounded-lg font-semibold transition" title="Cancel Appointment">
            Cancel
          </button>
        ` : `
          <span class="text-xs text-slate-400 italic">Closed</span>
        `}
        ${activeUser?.role === 'DOCTOR' && a.status !== 'CANCELLED' ? `
          <button onclick="openMedicalRecordModalForApt(${a.id})" class="text-xs bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1.5 rounded-lg font-medium transition">
            + Clinical Note
          </button>
        ` : ''}
      </td>
    </tr>
  `).join('');
}

function changeAppointmentStatus(id, newStatus) {
  API.updateAppointmentStatus(id, newStatus);
  renderAppointments();
  showToast(`Appointment status updated to ${newStatus}`, 'success');
}

// -------------------------------------------------------------
// MODULE: MEDICAL RECORDS (EMR)
// -------------------------------------------------------------
function renderMedicalRecords() {
  const allRecords = API.getMedicalRecords();
  const container = document.getElementById('medicalRecordsList');
  if (!container) return;

  let records = allRecords;
  if (activeUser?.role === 'PATIENT') {
    records = allRecords.filter(r => r.patientId === (activeUser.patientId || 1));
  } else if (activeUser?.role === 'DOCTOR') {
    records = allRecords.filter(r => r.doctorId === (activeUser.doctorId || 1));
  }

  if (records.length === 0) {
    container.innerHTML = `<div class="text-center py-12 text-slate-400">No medical records found.</div>`;
    return;
  }

  container.innerHTML = records.map(r => `
    <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
        <div>
          <span class="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg mr-2">
            Record #${r.id}
          </span>
          <span class="font-bold text-slate-900 text-base">${r.diagnosis}</span>
        </div>
        <div class="text-xs text-slate-400 font-medium">
          Date: <strong class="text-slate-700">${r.date}</strong> • Doctor: <strong class="text-slate-700">${r.doctorName}</strong>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-slate-50 p-3 rounded-xl">
          <div class="font-bold text-slate-700 mb-1">Patient Details</div>
          <div class="text-slate-900 font-semibold">${r.patientName}</div>
          <div class="text-slate-500 mt-1">Reported Symptoms: <span class="text-slate-700">${r.symptoms}</span></div>
        </div>

        <div class="bg-slate-50 p-3 rounded-xl">
          <div class="font-bold text-slate-700 mb-1">Clinical Plan & Follow-Up</div>
          <div class="text-slate-700 leading-relaxed">${r.clinicalNotes}</div>
          <div class="text-teal-700 font-semibold mt-2">Next Follow-Up: ${r.followUpDate}</div>
        </div>
      </div>

      ${activeUser?.role !== 'PATIENT' ? `
        <div class="mt-4 flex justify-end gap-2">
          <button onclick="openPrescriptionModalForPatient(${r.patientId}, '${r.doctorName}')" class="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold px-3 py-1.5 rounded-lg transition">
            + Write Prescription
          </button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// -------------------------------------------------------------
// MODULE: PRESCRIPTIONS
// -------------------------------------------------------------
function renderPrescriptions() {
  const allPrescriptions = API.getPrescriptions();
  const container = document.getElementById('prescriptionsGrid');
  if (!container) return;

  let prescriptions = allPrescriptions;
  if (activeUser?.role === 'PATIENT') {
    prescriptions = allPrescriptions.filter(rx => rx.patientId === (activeUser.patientId || 1));
  } else if (activeUser?.role === 'DOCTOR') {
    prescriptions = allPrescriptions.filter(rx => rx.doctorId === (activeUser.doctorId || 1));
  }

  if (prescriptions.length === 0) {
    container.innerHTML = `<div class="col-span-2 text-center py-12 text-slate-400">No prescriptions found.</div>`;
    return;
  }

  container.innerHTML = prescriptions.map(rx => `
    <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div>
          <span class="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
            ${rx.rxNumber}
          </span>
          <h3 class="font-bold text-slate-900 text-base mt-1">${rx.patientName}</h3>
        </div>
        <div class="text-right">
          <div class="text-xs text-slate-400">${rx.date}</div>
          <div class="text-xs font-semibold text-slate-700">${rx.doctorName}</div>
        </div>
      </div>

      <div class="space-y-2 mb-4">
        <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Prescribed Medicines (${rx.items.length})</div>
        <div class="space-y-1.5">
          ${rx.items.map(item => `
            <div class="text-xs p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <strong class="text-slate-900">${item.medicine}</strong>
                <span class="text-slate-500 ml-1">(${item.dosage})</span>
                <div class="text-[11px] text-teal-700">${item.frequency} • ${item.duration}</div>
              </div>
              <span class="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">${item.timing}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="text-xs text-slate-500 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 mb-4">
        <strong>Instructions:</strong> ${rx.instructions}
      </div>

      <div class="flex justify-end">
        <button onclick="viewPrescriptionSlip(${rx.id})" class="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5">
          <span>🖨️</span> View & Print Slip
        </button>
      </div>
    </div>
  `).join('');
}

function viewPrescriptionSlip(prescriptionId) {
  const rx = API.getPrescriptions().find(r => r.id === Number(prescriptionId));
  if (!rx) return;

  const patient = API.getPatientById(rx.patientId);
  const slipContainer = document.getElementById('printablePrescriptionArea');
  if (!slipContainer) return;

  slipContainer.innerHTML = `
    <div class="prescription-pad p-8 rounded-2xl">
      <div class="flex items-start justify-between border-b-2 border-teal-600 pb-4 mb-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl text-teal-600 font-extrabold">⚕</span>
            <h2 class="text-2xl font-extrabold tracking-tight text-slate-900">CareConnect Hospital</h2>
          </div>
          <p class="text-xs text-slate-500 mt-1">Multi-Specialty Healthcare & Clinical Research Centre</p>
          <p class="text-xs text-slate-400">Tel: +1 (800) 555-CARE • info@careconnect.com</p>
        </div>
        <div class="text-right">
          <h3 class="font-bold text-slate-900 text-base">${rx.doctorName}</h3>
          <p class="text-xs text-teal-700 font-semibold">${rx.doctorSpecialization}</p>
          <p class="text-xs text-slate-400">Reg No: MED-${1000 + rx.doctorId}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl mb-6 text-xs">
        <div>
          <span class="text-slate-400 font-medium">Patient Name:</span>
          <div class="font-bold text-slate-900 text-sm">${rx.patientName}</div>
        </div>
        <div>
          <span class="text-slate-400 font-medium">MRN:</span>
          <div class="font-mono font-bold text-slate-800">${patient ? patient.mrn : 'N/A'}</div>
        </div>
        <div>
          <span class="text-slate-400 font-medium">Age / Gender:</span>
          <div class="font-semibold text-slate-800">${patient ? `${calculateAge(patient.dob)} yrs / ${patient.gender}` : 'N/A'}</div>
        </div>
        <div>
          <span class="text-slate-400 font-medium">Date & Rx ID:</span>
          <div class="font-semibold text-slate-800">${rx.date} (${rx.rxNumber})</div>
        </div>
      </div>

      <div class="mb-8">
        <div class="text-3xl font-serif font-bold text-teal-700 mb-4 select-none">℞</div>
        <div class="border border-slate-200 rounded-xl overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th class="py-2.5 px-4">#</th>
                <th class="py-2.5 px-4">Medicine Name</th>
                <th class="py-2.5 px-4">Dosage</th>
                <th class="py-2.5 px-4">Frequency</th>
                <th class="py-2.5 px-4">Duration</th>
                <th class="py-2.5 px-4">Instructions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${rx.items.map((it, idx) => `
                <tr>
                  <td class="py-3 px-4 font-bold text-slate-400">${idx + 1}</td>
                  <td class="py-3 px-4 font-bold text-slate-900">${it.medicine}</td>
                  <td class="py-3 px-4 text-slate-700">${it.dosage}</td>
                  <td class="py-3 px-4 font-medium text-teal-800">${it.frequency}</td>
                  <td class="py-3 px-4 text-slate-700">${it.duration}</td>
                  <td class="py-3 px-4 text-slate-500">${it.timing}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-slate-50 p-4 rounded-xl mb-12 text-xs">
        <div class="font-bold text-slate-800 mb-1">Doctor's Special Instructions:</div>
        <p class="text-slate-600">${rx.instructions}</p>
      </div>

      <div class="flex justify-between items-end pt-8 border-t border-slate-200">
        <div class="text-[11px] text-slate-400">
          This is a computer-verified digital prescription under CareConnect PRMS.
        </div>
        <div class="text-center">
          <div class="font-serif italic text-teal-800 text-lg mb-1 font-semibold">${rx.doctorName}</div>
          <div class="w-40 border-t border-slate-400"></div>
          <span class="text-xs text-slate-500 font-medium">Doctor's Digital Signature</span>
        </div>
      </div>
    </div>
  `;

  openModal('modalPrescriptionSlip');
}

// -------------------------------------------------------------
// MODULE: DIAGNOSTIC & MEDICAL REPORTS
// -------------------------------------------------------------
let selectedReportFile = null;

function handleReportFileSelect(input) {
  if (input.files && input.files[0]) {
    selectedReportFile = input.files[0];
    const label = document.getElementById('reportFileLabel');
    if (label) {
      label.innerHTML = `<span class="text-emerald-700 font-bold">✓ Selected: ${selectedReportFile.name} (${Math.round(selectedReportFile.size / 1024)} KB)</span>`;
    }
  }
}

function renderReports() {
  const allReports = API.getReports();
  const grid = document.getElementById('reportsGrid');
  const catFilter = document.getElementById('reportCategoryFilter')?.value || 'ALL';

  if (!grid) return;

  let reports = allReports;
  if (activeUser?.role === 'PATIENT') {
    reports = allReports.filter(r => r.patientId === (activeUser.patientId || 1));
  } else if (activeUser?.role === 'DOCTOR') {
    reports = allReports.filter(r => r.doctorId === (activeUser.doctorId || 1));
  }

  const filtered = catFilter === 'ALL'
    ? reports
    : reports.filter(r => r.category.toLowerCase().includes(catFilter.toLowerCase()));

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-span-3 text-center py-12 text-slate-400">No medical diagnostic reports found.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(r => `
    <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
            ${r.reportNumber}
          </span>
          <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            ${r.status}
          </span>
        </div>
        <h3 class="font-bold text-slate-900 text-base mb-1">${r.title}</h3>
        <p class="text-xs text-teal-600 font-semibold mb-3">${r.category}</p>
        
        <div class="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5 mb-3">
          <div class="flex justify-between">
            <span class="text-slate-400">Patient:</span>
            <span class="font-bold text-slate-900">${r.patientName}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Ordering Doctor:</span>
            <span class="font-medium text-slate-800">${r.doctorName}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Date:</span>
            <span class="font-medium text-slate-800">${r.date}</span>
          </div>
        </div>

        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-xs text-slate-600">
          <div class="font-bold text-slate-700 mb-0.5">Clinical Remarks:</div>
          <p class="leading-relaxed line-clamp-2">${r.summary}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button onclick="viewReportDetails(${r.id})" class="flex-1 text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-xl transition text-center shadow-xs flex items-center justify-center gap-1.5">
          <span>👁️</span> <span>View Report</span>
        </button>
        <button onclick="downloadReportFile(${r.id})" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-xl transition text-center flex items-center gap-1" title="Download Document">
          <span>⬇️</span> PDF
        </button>
      </div>
    </div>
  `).join('');
}

function viewReportDetails(reportId) {
  const r = API.getReportById(reportId);
  if (!r) return;

  const patient = API.getPatientById(r.patientId);
  const container = document.getElementById('printableReportArea');
  if (!container) return;

  container.innerHTML = `
    <div class="p-8 rounded-2xl bg-white text-slate-900">
      <div class="flex items-start justify-between border-b-2 border-teal-600 pb-4 mb-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl text-teal-600 font-extrabold">⚕</span>
            <h2 class="text-2xl font-extrabold tracking-tight text-slate-900">CareConnect Diagnostic Center</h2>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Division of Clinical Pathology, Radiology & Diagnostic Testing</p>
          <p class="text-xs text-slate-400">Tel: +1 (800) 555-CARE • diagnostics@careconnect.com</p>
        </div>
        <div class="text-right">
          <span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-1">
            Official EMR Record
          </span>
          <div class="text-xs font-mono text-slate-500">Ref: ${r.reportNumber}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl mb-6 text-xs border border-slate-100">
        <div>
          <span class="text-slate-400 font-medium">Patient Name:</span>
          <div class="font-bold text-slate-900 text-sm">${r.patientName}</div>
        </div>
        <div>
          <span class="text-slate-400 font-medium">MRN:</span>
          <div class="font-mono font-bold text-slate-800">${patient ? patient.mrn : 'N/A'}</div>
        </div>
        <div>
          <span class="text-slate-400 font-medium">Ordering Doctor:</span>
          <div class="font-semibold text-slate-800">${r.doctorName}</div>
        </div>
        <div>
          <span class="text-slate-400 font-medium">Test Date:</span>
          <div class="font-semibold text-slate-800">${r.date}</div>
        </div>
      </div>

      <div class="mb-6">
        <div class="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
          <h3 class="text-base font-bold text-slate-900">${r.title}</h3>
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800">${r.category}</span>
        </div>
        <div class="bg-slate-50 p-4 rounded-xl text-xs space-y-2 border border-slate-200">
          <div class="font-bold text-slate-800 text-sm">Diagnostic Findings & Observations:</div>
          <p class="text-slate-700 leading-relaxed text-sm">${r.summary}</p>
        </div>
      </div>

      <div class="mb-6">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attached Scan / Examination Data</div>
        <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 text-center">
          <img src="${r.fileUrl}" alt="Diagnostic Scan" class="w-full max-h-64 object-cover" />
          <div class="p-2 text-xs font-medium text-slate-600 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span>Attachment: <strong>${r.fileName}</strong></span>
            <span class="text-emerald-700 font-bold">✓ High Resolution Verified</span>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-end pt-6 border-t border-slate-200 text-xs">
        <div class="text-slate-400 text-[11px]">
          Digitally generated by CareConnect PRMS. Verified by Central Clinical Laboratory.
        </div>
        <div class="text-center">
          <div class="font-serif italic text-teal-800 text-base mb-1 font-semibold">${r.doctorName}</div>
          <div class="w-36 border-t border-slate-400"></div>
          <span class="text-[11px] text-slate-500">Authorized Medical Officer</span>
        </div>
      </div>
    </div>
  `;

  openModal('modalViewReport');
}

function downloadReportFile(reportId) {
  const r = API.getReportById(reportId);
  if (!r) return;
  showToast(`Downloading ${r.fileName}...`, 'success');
  const link = document.createElement('a');
  link.href = r.fileUrl;
  link.download = r.fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function openUploadReportModal() {
  populateDropdowns();
  const dateInput = document.getElementById('reportDate');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

  if (activeUser?.role === 'DOCTOR' && activeUser.doctorId) {
    const docSelect = document.getElementById('reportDoctorSelect');
    if (docSelect) docSelect.value = activeUser.doctorId;
  }
  openModal('modalUploadReport');
}

function openUploadReportModalForPatient(patientId) {
  openUploadReportModal();
  const patSelect = document.getElementById('reportPatientSelect');
  if (patSelect) patSelect.value = patientId;
}

// -------------------------------------------------------------
// MODALS & EVENT LISTENERS
// -------------------------------------------------------------
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function setupEventListeners() {
  // Add Patient Form Submit
  const formAddPatient = document.getElementById('formAddPatient');
  if (formAddPatient && !formAddPatient.dataset.bound) {
    formAddPatient.dataset.bound = "true";
    formAddPatient.addEventListener('submit', (e) => {
      e.preventDefault();
      const newP = {
        name: document.getElementById('patName').value,
        email: document.getElementById('patEmail').value,
        phone: document.getElementById('patPhone').value,
        dob: document.getElementById('patDob').value,
        gender: document.getElementById('patGender').value,
        bloodGroup: document.getElementById('patBloodGroup').value,
        address: document.getElementById('patAddress').value,
        emergencyContact: document.getElementById('patEmergencyContact').value,
        allergies: document.getElementById('patAllergies').value || 'None reported',
        chronicConditions: document.getElementById('patChronic').value || 'None'
      };

      const saved = API.createPatient(newP);
      closeModal('modalAddPatient');
      formAddPatient.reset();
      renderPatients();
      showToast(`Patient ${saved.name} registered with MRN: ${saved.mrn}`, 'success');
    });
  }

  // Add Doctor Form Submit
  const formAddDoctor = document.getElementById('formAddDoctor');
  if (formAddDoctor && !formAddDoctor.dataset.bound) {
    formAddDoctor.dataset.bound = "true";
    formAddDoctor.addEventListener('submit', (e) => {
      e.preventDefault();
      const newDoc = {
        name: document.getElementById('docName').value,
        email: document.getElementById('docEmail').value,
        phone: document.getElementById('docPhone').value,
        specialization: document.getElementById('docSpecialization').value,
        qualification: document.getElementById('docQualification').value,
        experience: document.getElementById('docExperience').value,
        department: document.getElementById('docDepartment').value,
        roomNo: document.getElementById('docRoom').value,
        consultationFee: Number(document.getElementById('docFee').value) || 50
      };

      const saved = API.createDoctor(newDoc);
      closeModal('modalAddDoctor');
      formAddDoctor.reset();
      renderDoctors();
      showToast(`Doctor ${saved.name} onboarded successfully!`, 'success');
    });
  }

  // Book Appointment Form Submit
  const formBookAppointment = document.getElementById('formBookAppointment');
  if (formBookAppointment && !formBookAppointment.dataset.bound) {
    formBookAppointment.dataset.bound = "true";
    formBookAppointment.addEventListener('submit', (e) => {
      e.preventDefault();
      const apt = {
        patientId: document.getElementById('aptPatientSelect').value,
        doctorId: document.getElementById('aptDoctorSelect').value,
        dateTime: document.getElementById('aptDateTime').value,
        reason: document.getElementById('aptReason').value
      };

      const saved = API.createAppointment(apt);
      closeModal('modalBookAppointment');
      formBookAppointment.reset();
      renderAppointments();
      showToast(`Appointment booked successfully! Ref: ${saved.appointmentNumber}`, 'success');
    });
  }

  // Add Medical Record Form Submit
  const formAddRecord = document.getElementById('formAddRecord');
  if (formAddRecord && !formAddRecord.dataset.bound) {
    formAddRecord.dataset.bound = "true";
    formAddRecord.addEventListener('submit', (e) => {
      e.preventDefault();
      const rec = {
        patientId: document.getElementById('recPatientSelect').value,
        doctorId: document.getElementById('recDoctorSelect').value,
        appointmentId: document.getElementById('recAppointmentSelect').value || null,
        date: document.getElementById('recDate').value,
        diagnosis: document.getElementById('recDiagnosis').value,
        symptoms: document.getElementById('recSymptoms').value,
        clinicalNotes: document.getElementById('recNotes').value,
        followUpDate: document.getElementById('recFollowUp').value
      };

      const saved = API.createMedicalRecord(rec);
      closeModal('modalAddRecord');
      formAddRecord.reset();
      renderMedicalRecords();
      showToast(`Clinical Medical Record saved for ${saved.patientName}!`, 'success');
    });
  }

  // Dynamic Prescription Item Rows
  const btnAddRxItem = document.getElementById('btnAddRxItem');
  if (btnAddRxItem && !btnAddRxItem.dataset.bound) {
    btnAddRxItem.dataset.bound = "true";
    btnAddRxItem.addEventListener('click', () => {
      addPrescriptionRow();
    });
  }

  // Create Prescription Form Submit
  const formCreateRx = document.getElementById('formCreateRx');
  if (formCreateRx && !formCreateRx.dataset.bound) {
    formCreateRx.dataset.bound = "true";
    formCreateRx.addEventListener('submit', (e) => {
      e.preventDefault();
      const rows = document.querySelectorAll('.rx-item-row');
      const items = [];
      rows.forEach(r => {
        const med = r.querySelector('.rx-med')?.value;
        const dose = r.querySelector('.rx-dose')?.value;
        const freq = r.querySelector('.rx-freq')?.value;
        const dur = r.querySelector('.rx-dur')?.value;
        const tim = r.querySelector('.rx-timing')?.value;
        if (med) {
          items.push({ medicine: med, dosage: dose, frequency: freq, duration: dur, timing: tim });
        }
      });

      if (items.length === 0) {
        showToast('Please add at least one medicine item.', 'error');
        return;
      }

      const rx = {
        patientId: document.getElementById('rxPatientSelect').value,
        doctorId: document.getElementById('rxDoctorSelect').value,
        instructions: document.getElementById('rxInstructions').value,
        items: items
      };

      const saved = API.createPrescription(rx);
      closeModal('modalCreatePrescription');
      formCreateRx.reset();
      renderPrescriptions();
      showToast(`Prescription ${saved.rxNumber} created successfully!`, 'success');
      viewPrescriptionSlip(saved.id);
    });
  }

  // Upload Report Form Submit
  const formUploadReport = document.getElementById('formUploadReport');
  if (formUploadReport && !formUploadReport.dataset.bound) {
    formUploadReport.dataset.bound = "true";
    formUploadReport.addEventListener('submit', (e) => {
      e.preventDefault();
      const patId = document.getElementById('reportPatientSelect').value;
      const docId = document.getElementById('reportDoctorSelect').value;
      const title = document.getElementById('reportTitle').value.trim();
      const category = document.getElementById('reportCategory').value;
      const date = document.getElementById('reportDate').value;
      const summary = document.getElementById('reportSummary').value.trim();

      const newRep = API.uploadReport({
        patientId: patId,
        doctorId: docId,
        title: title,
        category: category,
        date: date,
        summary: summary,
        fileName: selectedReportFile ? selectedReportFile.name : `${title.replace(/\s+/g, '_')}_Report.pdf`,
        fileUrl: selectedReportFile ? "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80"
      });

      closeModal('modalUploadReport');
      formUploadReport.reset();
      selectedReportFile = null;
      const label = document.getElementById('reportFileLabel');
      if (label) label.textContent = 'Click to choose or drag & drop report (PDF, PNG, JPG)';

      renderReports();
      showToast(`Diagnostic Report "${newRep.title}" uploaded successfully for ${newRep.patientName}!`, 'success');
      viewReportDetails(newRep.id);
    });
  }
}

// Helpers for opening modals with pre-selected options
function openBookAppointmentModal() {
  populateDropdowns();
  openModal('modalBookAppointment');
}

function openBookAppointmentForPatient(patientId) {
  populateDropdowns();
  const select = document.getElementById('aptPatientSelect');
  if (select) select.value = patientId;
  openModal('modalBookAppointment');
}

function openBookAppointmentForDoctor(doctorId) {
  populateDropdowns();
  const select = document.getElementById('aptDoctorSelect');
  if (select) select.value = doctorId;
  openModal('modalBookAppointment');
}

function openMedicalRecordModal() {
  populateDropdowns();
  openModal('modalAddRecord');
}

function openMedicalRecordModalForApt(appointmentId) {
  populateDropdowns();
  const apt = API.getAppointments().find(a => a.id === appointmentId);
  if (apt) {
    const pSel = document.getElementById('recPatientSelect');
    const dSel = document.getElementById('recDoctorSelect');
    const aSel = document.getElementById('recAppointmentSelect');
    if (pSel) pSel.value = apt.patientId;
    if (dSel) dSel.value = apt.doctorId;
    if (aSel) aSel.value = apt.id;
  }
  openModal('modalAddRecord');
}

function openPrescriptionModalForPatient(patientId, doctorName) {
  populateDropdowns();
  const pSel = document.getElementById('rxPatientSelect');
  if (pSel) pSel.value = patientId;
  openModal('modalCreatePrescription');
}

function openCreatePrescriptionModal() {
  populateDropdowns();
  const container = document.getElementById('rxItemsContainer');
  if (container) {
    container.innerHTML = '';
    addPrescriptionRow();
  }
  openModal('modalCreatePrescription');
}

function addPrescriptionRow() {
  const container = document.getElementById('rxItemsContainer');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'rx-item-row grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200';
  row.innerHTML = `
    <div class="col-span-12 sm:col-span-3">
      <input type="text" class="rx-med w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500" placeholder="e.g. Paracetamol 500mg" required />
    </div>
    <div class="col-span-6 sm:col-span-2">
      <input type="text" class="rx-dose w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300" placeholder="1 Tab" required />
    </div>
    <div class="col-span-6 sm:col-span-3">
      <select class="rx-freq w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300">
        <option>Once Daily (OD)</option>
        <option selected>Twice Daily (BD)</option>
        <option>Thrice Daily (TID)</option>
        <option>As needed (SOS)</option>
      </select>
    </div>
    <div class="col-span-6 sm:col-span-2">
      <input type="text" class="rx-dur w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300" placeholder="5 Days" required />
    </div>
    <div class="col-span-5 sm:col-span-2">
      <select class="rx-timing w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300">
        <option>After Food</option>
        <option>Before Food</option>
        <option>With Water</option>
      </select>
    </div>
  `;
  container.appendChild(row);
}

function populateDropdowns() {
  const patients = API.getPatients();
  const doctors = API.getDoctors();
  const appointments = API.getAppointments();

  const aptPatient = document.getElementById('aptPatientSelect');
  const aptDoctor = document.getElementById('aptDoctorSelect');
  if (aptPatient) {
    aptPatient.innerHTML = patients.map(p => `<option value="${p.id}">${p.name} (${p.mrn})</option>`).join('');
  }
  if (aptDoctor) {
    aptDoctor.innerHTML = doctors.map(d => `<option value="${d.id}">${d.name} - ${d.specialization}</option>`).join('');
  }

  const recPatient = document.getElementById('recPatientSelect');
  const recDoctor = document.getElementById('recDoctorSelect');
  const recApt = document.getElementById('recAppointmentSelect');
  if (recPatient) {
    recPatient.innerHTML = patients.map(p => `<option value="${p.id}">${p.name} (${p.mrn})</option>`).join('');
  }
  if (recDoctor) {
    recDoctor.innerHTML = doctors.map(d => `<option value="${d.id}">${d.name} (${d.specialization})</option>`).join('');
  }
  if (recApt) {
    recApt.innerHTML = `<option value="">-- Optional: Link to Appointment --</option>` + 
      appointments.map(a => `<option value="${a.id}">${a.appointmentNumber} - ${a.patientName} with ${a.doctorName}</option>`).join('');
  }

  const rxPatient = document.getElementById('rxPatientSelect');
  const rxDoctor = document.getElementById('rxDoctorSelect');
  if (rxPatient) {
    rxPatient.innerHTML = patients.map(p => `<option value="${p.id}">${p.name} (${p.mrn})</option>`).join('');
  }
  if (rxDoctor) {
    rxDoctor.innerHTML = doctors.map(d => `<option value="${d.id}">${d.name} (${d.specialization})</option>`).join('');
  }

  const repPatient = document.getElementById('reportPatientSelect');
  const repDoctor = document.getElementById('reportDoctorSelect');
  if (repPatient) {
    repPatient.innerHTML = patients.map(p => `<option value="${p.id}">${p.name} (${p.mrn})</option>`).join('');
  }
  if (repDoctor) {
    repDoctor.innerHTML = doctors.map(d => `<option value="${d.id}">${d.name} (${d.specialization}) - [${d.status}]</option>`).join('');
  }
}

// Formatting Utilities
function getStatusBadge(status) {
  switch (status) {
    case 'SCHEDULED':
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">Scheduled</span>`;
    case 'CONFIRMED':
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">Confirmed</span>`;
    case 'COMPLETED':
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Completed</span>`;
    case 'CANCELLED':
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Cancelled</span>`;
    default:
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">${status}</span>`;
  }
}

function formatDateTime(isoString) {
  if (!isoString) return 'N/A';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function calculateAge(dobString) {
  if (!dobString) return '';
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
