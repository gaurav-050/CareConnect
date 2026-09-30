// CareConnect - Initial Mock Seed Data for College Demo

const INITIAL_DATA = {
  currentUser: {
    id: 1,
    name: "Dr. Sarah Jenkins",
    email: "doctor@careconnect.com",
    role: "DOCTOR", // 'ADMIN' | 'DOCTOR' | 'PATIENT'
    specialization: "Cardiologist",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
  },
  
  doctors: [
    {
      id: 1,
      name: "Dr. Sarah Jenkins",
      email: "sarah.jenkins@careconnect.com",
      phone: "+1 555-0192",
      specialization: "Cardiology",
      qualification: "MBBS, MD (Cardiology)",
      experience: "10 Years",
      department: "Heart & Vascular",
      roomNo: "Room 302",
      consultationFee: 75,
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
      status: "Available"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "michael.chen@careconnect.com",
      phone: "+1 555-0193",
      specialization: "General Medicine",
      qualification: "MBBS, DNB (Internal Medicine)",
      experience: "8 Years",
      department: "Outpatient Clinic",
      roomNo: "Room 105",
      consultationFee: 50,
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
      status: "Available"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@careconnect.com",
      phone: "+1 555-0194",
      specialization: "Pediatrics",
      qualification: "MBBS, MD (Pediatrics)",
      experience: "6 Years",
      department: "Child Care",
      roomNo: "Room 204",
      consultationFee: 60,
      avatar: "https://images.unsplash.com/photo-1594824813583-149b5c2a39a7?w=150&auto=format&fit=crop&q=80",
      status: "In Consultation"
    },
    {
      id: 4,
      name: "Dr. Robert Vance",
      email: "robert.vance@careconnect.com",
      phone: "+1 555-0195",
      specialization: "Orthopedics",
      qualification: "MS (Orthopedics), FRCS",
      experience: "14 Years",
      department: "Bone & Joint",
      roomNo: "Room 401",
      consultationFee: 90,
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
      status: "Available"
    }
  ],

  patients: [
    {
      id: 1,
      mrn: "PAT-2026-001",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+1 555-3829",
      dob: "1994-06-15",
      gender: "Male",
      bloodGroup: "O+",
      address: "42 Elm Street, Springfield",
      emergencyContact: "Maria Johnson (+1 555-9988)",
      allergies: "Penicillin, Peanuts",
      chronicConditions: "Mild Asthma",
      status: "Active"
    },
    {
      id: 2,
      mrn: "PAT-2026-002",
      name: "Sophia Martinez",
      email: "sophia.m@example.com",
      phone: "+1 555-7281",
      dob: "1988-11-22",
      gender: "Female",
      bloodGroup: "A+",
      address: "108 Sunset Blvd, Los Angeles",
      emergencyContact: "David Martinez (+1 555-4433)",
      allergies: "Sulfa Drugs",
      chronicConditions: "Hypertension",
      status: "Active"
    },
    {
      id: 3,
      mrn: "PAT-2026-003",
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "+1 555-1920",
      dob: "2001-03-08",
      gender: "Male",
      bloodGroup: "B+",
      address: "77 Pine Road, Chicago",
      emergencyContact: "Grace Kim (+1 555-8811)",
      allergies: "None reported",
      chronicConditions: "None",
      status: "Active"
    },
    {
      id: 4,
      mrn: "PAT-2026-004",
      name: "Emma Watson",
      email: "emma.watson@example.com",
      phone: "+1 555-6677",
      dob: "1997-09-30",
      gender: "Female",
      bloodGroup: "AB+",
      address: "15 Beacon Hill, Boston",
      emergencyContact: "John Watson (+1 555-2233)",
      allergies: "Aspirin",
      chronicConditions: "Seasonal Allergies",
      status: "Active"
    }
  ],

  appointments: [
    {
      id: 1,
      appointmentNumber: "APT-1001",
      patientId: 1,
      patientName: "Alex Johnson",
      doctorId: 1,
      doctorName: "Dr. Sarah Jenkins",
      specialization: "Cardiology",
      dateTime: "2026-09-30T10:00",
      reason: "Quarterly heart rate checkup & palpitations review",
      status: "SCHEDULED"
    },
    {
      id: 2,
      appointmentNumber: "APT-1002",
      patientId: 2,
      patientName: "Sophia Martinez",
      doctorId: 2,
      doctorName: "Dr. Michael Chen",
      specialization: "General Medicine",
      dateTime: "2026-09-29T14:30",
      reason: "High blood pressure follow-up and prescription refill",
      status: "CONFIRMED"
    },
    {
      id: 3,
      appointmentNumber: "APT-1003",
      patientId: 3,
      patientName: "David Kim",
      doctorId: 4,
      doctorName: "Dr. Robert Vance",
      specialization: "Orthopedics",
      dateTime: "2026-09-28T11:15",
      reason: "Right knee pain after sports training",
      status: "COMPLETED"
    },
    {
      id: 4,
      appointmentNumber: "APT-1004",
      patientId: 4,
      patientName: "Emma Watson",
      doctorId: 1,
      doctorName: "Dr. Sarah Jenkins",
      specialization: "Cardiology",
      dateTime: "2026-09-27T09:00",
      reason: "Pre-employment ECG and fitness clearance",
      status: "COMPLETED"
    }
  ],

  medicalRecords: [
    {
      id: 1,
      patientId: 1,
      patientName: "Alex Johnson",
      doctorId: 1,
      doctorName: "Dr. Sarah Jenkins",
      appointmentId: 1,
      date: "2026-09-25",
      diagnosis: "Sinus Tachycardia (Stress induced)",
      symptoms: "Mild palpitations, fatigue during night shifts",
      clinicalNotes: "Normal heart sounds, resting BP 124/82 mmHg, resting HR 96 bpm. ECG shows normal sinus rhythm with mild tachycardia. Advised reduction in caffeine intake and lifestyle modification.",
      followUpDate: "2026-10-25"
    },
    {
      id: 2,
      patientId: 3,
      patientName: "David Kim",
      doctorId: 4,
      doctorName: "Dr. Robert Vance",
      appointmentId: 3,
      date: "2026-09-28",
      diagnosis: "Grade 1 Medial Collateral Ligament (MCL) Strain",
      symptoms: "Swelling and tenderness along inner right knee joint",
      clinicalNotes: "No joint laxity or locking detected. X-Ray negative for fracture. RICE protocol recommended with knee brace for 10 days.",
      followUpDate: "2026-10-12"
    },
    {
      id: 3,
      patientId: 2,
      patientName: "Sophia Martinez",
      doctorId: 2,
      doctorName: "Dr. Michael Chen",
      appointmentId: 2,
      date: "2026-09-15",
      diagnosis: "Essential Stage 1 Hypertension",
      symptoms: "Occasional morning headaches, dizzy spells",
      clinicalNotes: "Sitting BP 142/92 mmHg. Fasting glucose normal. Recommended daily sodium restriction (<2g/day) and low-dose ACE inhibitor.",
      followUpDate: "2026-10-05"
    }
  ],

  prescriptions: [
    {
      id: 1,
      rxNumber: "RX-501",
      patientId: 1,
      patientName: "Alex Johnson",
      doctorId: 1,
      doctorName: "Dr. Sarah Jenkins",
      doctorSpecialization: "Cardiology",
      date: "2026-09-25",
      instructions: "Take with water. Avoid strenuous workouts immediately after dosing.",
      items: [
        {
          medicine: "Propranolol 10mg",
          dosage: "1 Tablet",
          frequency: "Twice daily (Morning & Evening)",
          duration: "14 Days",
          timing: "After Food"
        },
        {
          medicine: "Multivitamin B-Complex",
          dosage: "1 Capsule",
          frequency: "Once daily",
          duration: "30 Days",
          timing: "After Breakfast"
        }
      ]
    },
    {
      id: 2,
      rxNumber: "RX-502",
      patientId: 3,
      patientName: "David Kim",
      doctorId: 4,
      doctorName: "Dr. Robert Vance",
      doctorSpecialization: "Orthopedics",
      date: "2026-09-28",
      instructions: "Apply cold compress 3 times daily. Avoid jumping or running.",
      items: [
        {
          medicine: "Ibuprofen 400mg",
          dosage: "1 Tablet",
          frequency: "Twice daily as needed for pain",
          duration: "5 Days",
          timing: "After Food"
        },
        {
          medicine: "Diclofenac Sodium Gel 1%",
          dosage: "Thin layer",
          frequency: "3 times daily",
          duration: "7 Days",
          timing: "Topical application"
        }
      ]
    },
    {
      id: 3,
      rxNumber: "RX-503",
      patientId: 2,
      patientName: "Sophia Martinez",
      doctorId: 2,
      doctorName: "Dr. Michael Chen",
      doctorSpecialization: "General Medicine",
      date: "2026-09-15",
      instructions: "Monitor BP every morning before breakfast and record in log.",
      items: [
        {
          medicine: "Telmisartan 40mg",
          dosage: "1 Tablet",
          frequency: "Once daily (Morning)",
          duration: "30 Days",
          timing: "Before Breakfast"
        }
      ]
    }
  ],

  reports: [
    {
      id: 1,
      reportNumber: "REP-9001",
      title: "Comprehensive Metabolic & Lipid Profile",
      category: "Pathology & Blood",
      patientId: 1,
      patientName: "Alex Johnson",
      doctorId: 1,
      doctorName: "Dr. Sarah Jenkins",
      date: "2026-09-26",
      summary: "Resting fasting blood glucose 94 mg/dL. Total cholesterol 188 mg/dL. Normal electrolyte balance.",
      fileUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80",
      fileName: "Blood_Metabolic_Panel_Sept2026.pdf",
      status: "Verified & Normal"
    },
    {
      id: 2,
      reportNumber: "REP-9002",
      title: "12-Lead Diagnostic Electrocardiogram (ECG)",
      category: "Cardiology",
      patientId: 1,
      patientName: "Alex Johnson",
      doctorId: 1,
      doctorName: "Dr. Sarah Jenkins",
      date: "2026-09-25",
      summary: "Normal sinus rhythm, heart rate 94 bpm. Mild sinus tachycardia, no ischemic ST changes.",
      fileUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80",
      fileName: "12_Lead_ECG_Trace_Report.pdf",
      status: "Reviewed by Cardiologist"
    },
    {
      id: 3,
      reportNumber: "REP-9003",
      title: "Right Knee Digital Radiography (X-Ray)",
      category: "Radiology / Imaging",
      patientId: 3,
      patientName: "David Kim",
      doctorId: 4,
      doctorName: "Dr. Robert Vance",
      date: "2026-09-28",
      summary: "AP and Lateral views. No cortical breach or acute fracture. Soft tissue swelling over medial collateral ligament.",
      fileUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80",
      fileName: "Knee_XRay_AP_Lateral.pdf",
      status: "Normal Bones / Soft Tissue Sprain"
    }
  ]
};
