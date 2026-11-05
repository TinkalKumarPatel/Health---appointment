import bcrypt from 'bcryptjs';

// Realistic IDs
const ADMIN_ID = '650000000000000000000001';
const DOCTOR1_ID = '650000000000000000000011';
const DOCTOR2_ID = '650000000000000000000012';
const DOCTOR3_ID = '650000000000000000000013';
const DOCTOR4_ID = '650000000000000000000014';
const DOCTOR5_ID = '650000000000000000000015';
const PATIENT1_ID = '650000000000000000000021';
const PATIENT2_ID = '650000000000000000000022';

const DOC_PROFILE1_ID = '660000000000000000000011';
const DOC_PROFILE2_ID = '660000000000000000000012';
const DOC_PROFILE3_ID = '660000000000000000000013';
const DOC_PROFILE4_ID = '660000000000000000000014';
const DOC_PROFILE5_ID = '660000000000000000000015';

// Pre-hashed passwords for instant boot
const adminHash = bcrypt.hashSync('Admin@123', 10);
const doctorHash = bcrypt.hashSync('Doctor@123', 10);
const patientHash = bcrypt.hashSync('Patient@123', 10);

export const memoryDb = {
  users: [
    {
      _id: ADMIN_ID,
      name: 'System Administrator',
      email: 'admin1@example.com',
      password: adminHash,
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      _id: DOCTOR1_ID,
      name: 'Dr. Sarah Smith',
      email: 'doctor1@example.com',
      password: doctorHash,
      role: 'doctor',
      createdAt: new Date().toISOString()
    },
    {
      _id: DOCTOR2_ID,
      name: 'Dr. Marcus Johnson',
      email: 'doctor2@example.com',
      password: doctorHash,
      role: 'doctor',
      createdAt: new Date().toISOString()
    },
    {
      _id: DOCTOR3_ID,
      name: 'Dr. Emily Williams',
      email: 'doctor3@example.com',
      password: doctorHash,
      role: 'doctor',
      createdAt: new Date().toISOString()
    },
    {
      _id: DOCTOR4_ID,
      name: 'Dr. Robert Chen',
      email: 'doctor4@example.com',
      password: doctorHash,
      role: 'doctor',
      createdAt: new Date().toISOString()
    },
    {
      _id: DOCTOR5_ID,
      name: 'Dr. Lisa Davis',
      email: 'doctor5@example.com',
      password: doctorHash,
      role: 'doctor',
      createdAt: new Date().toISOString()
    },
    {
      _id: PATIENT1_ID,
      name: 'John Doe',
      email: 'patient1@example.com',
      password: patientHash,
      role: 'patient',
      createdAt: new Date().toISOString()
    },
    {
      _id: PATIENT2_ID,
      name: 'Alice Martin',
      email: 'patient2@example.com',
      password: patientHash,
      role: 'patient',
      createdAt: new Date().toISOString()
    }
  ],
  doctors: [
    {
      _id: DOC_PROFILE1_ID,
      user: DOCTOR1_ID,
      specialty: 'Cardiology',
      qualifications: ['MD (Cardiology)', 'FACC', 'MBBS (Honors)'],
      experienceYears: 14,
      fees: 120,
      locations: ['St. Jude Heart Center', 'Metro General Hospital'],
      availability: [
        { day: 1, start: '09:00', end: '17:00' },
        { day: 2, start: '09:00', end: '17:00' },
        { day: 3, start: '10:00', end: '16:00' },
        { day: 4, start: '09:00', end: '17:00' },
        { day: 5, start: '09:00', end: '14:00' }
      ]
    },
    {
      _id: DOC_PROFILE2_ID,
      user: DOCTOR2_ID,
      specialty: 'Dermatology',
      qualifications: ['MD (Dermatology)', 'FAAD'],
      experienceYears: 10,
      fees: 95,
      locations: ['Glow Skin Institute', 'Downtown Health Hub'],
      availability: [
        { day: 1, start: '10:00', end: '18:00' },
        { day: 3, start: '10:00', end: '18:00' },
        { day: 5, start: '09:00', end: '15:00' }
      ]
    },
    {
      _id: DOC_PROFILE3_ID,
      user: DOCTOR3_ID,
      specialty: 'Pediatrics',
      qualifications: ['MD (Pediatrics)', 'FAAP'],
      experienceYears: 8,
      fees: 80,
      locations: ['Children Wellness Clinic', 'Hope Children Hospital'],
      availability: [
        { day: 1, start: '08:30', end: '16:30' },
        { day: 2, start: '08:30', end: '16:30' },
        { day: 4, start: '08:30', end: '16:30' },
        { day: 6, start: '09:00', end: '13:00' }
      ]
    },
    {
      _id: DOC_PROFILE4_ID,
      user: DOCTOR4_ID,
      specialty: 'Neurology',
      qualifications: ['DM (Neurology)', 'MD', 'Member AAN'],
      experienceYears: 16,
      fees: 150,
      locations: ['Brain & Spine Institute', 'Central Medical Plaza'],
      availability: [
        { day: 2, start: '10:00', end: '17:00' },
        { day: 4, start: '10:00', end: '17:00' },
        { day: 5, start: '11:00', end: '17:00' }
      ]
    },
    {
      _id: DOC_PROFILE5_ID,
      user: DOCTOR5_ID,
      specialty: 'Orthopedics',
      qualifications: ['MS (Orthopedics)', 'Fellow Joint Replacement'],
      experienceYears: 12,
      fees: 110,
      locations: ['OrthoCare Specialists', 'City Surgical Hospital'],
      availability: [
        { day: 1, start: '09:00', end: '16:00' },
        { day: 3, start: '09:00', end: '16:00' },
        { day: 5, start: '09:00', end: '16:00' }
      ]
    }
  ],
  appointments: [
    {
      _id: '670000000000000000000001',
      patient: PATIENT1_ID,
      doctor: DOC_PROFILE1_ID,
      date: new Date(Date.now() + 24 * 3600 * 1000 * 2).toISOString(), // 2 days from now
      durationMinutes: 30,
      status: 'confirmed',
      notes: 'Routine cardiovascular checkup and ECG review'
    },
    {
      _id: '670000000000000000000002',
      patient: PATIENT1_ID,
      doctor: DOC_PROFILE2_ID,
      date: new Date(Date.now() - 24 * 3600 * 1000 * 5).toISOString(), // 5 days ago
      durationMinutes: 30,
      status: 'completed',
      notes: 'Seasonal allergy skin consultation'
    },
    {
      _id: '670000000000000000000003',
      patient: PATIENT2_ID,
      doctor: DOC_PROFILE3_ID,
      date: new Date(Date.now() + 24 * 3600 * 1000 * 3).toISOString(), // 3 days from now
      durationMinutes: 30,
      status: 'pending',
      notes: 'Child routine immunization assessment'
    }
  ]
};

// Helper to wrap raw user object with comparePassword
export const wrapUser = (u) => {
  if (!u) return null;
  return {
    ...u,
    id: u._id,
    comparePassword: async function (candidate) {
      return bcrypt.compare(candidate, this.password);
    },
    save: async function () {
      const idx = memoryDb.users.findIndex(x => x._id === this._id);
      if (idx !== -1) memoryDb.users[idx] = { ...this };
      return this;
    }
  };
};

export const wrapDoctor = (d) => {
  if (!d) return null;
  const userObj = memoryDb.users.find(u => u._id === (typeof d.user === 'object' ? d.user._id : d.user));
  return {
    ...d,
    id: d._id,
    user: userObj ? { _id: userObj._id, name: userObj.name, email: userObj.email, role: userObj.role } : null,
    save: async function () {
      const idx = memoryDb.doctors.findIndex(x => x._id === this._id);
      if (idx !== -1) memoryDb.doctors[idx] = { ...this };
      return this;
    }
  };
};

export const wrapAppointment = (a) => {
  if (!a) return null;
  const patientObj = memoryDb.users.find(u => u._id === (typeof a.patient === 'object' ? a.patient._id : a.patient));
  const doctorDoc = memoryDb.doctors.find(d => d._id === (typeof a.doctor === 'object' ? a.doctor._id : a.doctor));
  const doctorUser = doctorDoc ? memoryDb.users.find(u => u._id === (typeof doctorDoc.user === 'object' ? doctorDoc.user._id : doctorDoc.user)) : null;

  return {
    ...a,
    id: a._id,
    patient: patientObj ? { _id: patientObj._id, name: patientObj.name, email: patientObj.email } : a.patient,
    doctor: doctorDoc ? {
      _id: doctorDoc._id,
      specialty: doctorDoc.specialty,
      fees: doctorDoc.fees,
      locations: doctorDoc.locations,
      user: doctorUser ? { _id: doctorUser._id, name: doctorUser.name, email: doctorUser.email } : null
    } : a.doctor,
    save: async function () {
      const idx = memoryDb.appointments.findIndex(x => x._id === this._id);
      if (idx !== -1) memoryDb.appointments[idx] = { ...this };
      return this;
    }
  };
};

