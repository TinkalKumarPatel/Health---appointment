import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

dotenv.config({ path: '../../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/health-appointment';

const connect = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected for seeding');
};

const createUsers = async () => {
  const users = [];
  // admins
  for (let i = 1; i <= 2; i++) {
    const hash = await bcrypt.hash('Admin@123', 10);
    users.push({ name: `Admin ${i}`, email: `admin${i}@example.com`, password: hash, role: 'admin' });
  }
  // doctors
  for (let i = 1; i <= 5; i++) {
    const hash = await bcrypt.hash('Doctor@123', 10);
    users.push({ name: `Dr. ${['Smith','Johnson','Williams','Brown','Jones'][i-1]}`, email: `doctor${i}@example.com`, password: hash, role: 'doctor' });
  }
  // patients
  for (let i = 1; i <= 10; i++) {
    const hash = await bcrypt.hash('Patient@123', 10);
    users.push({ name: `Patient ${i}`, email: `patient${i}@example.com`, password: hash, role: 'patient' });
  }
  const created = await User.insertMany(users);
  console.log('Users created');
  return created;
};

const createDoctors = async (users) => {
  const doctorUsers = users.filter(u => u.role === 'doctor');
  const specialties = ['Cardiology','Dermatology','Pediatrics','Neurology','Orthopedics'];
  const doctors = doctorUsers.map((u, idx) => ({
    user: u._id,
    specialty: specialties[idx % specialties.length],
    qualifications: ['MBBS', 'MD'],
    experienceYears: 5 + idx,
    fees: 50 + idx * 20,
    locations: ['City Hospital', 'Downtown Clinic'],
    availability: [
      { day: 1, start: '09:00', end: '17:00' },
      { day: 3, start: '10:00', end: '16:00' },
      { day: 5, start: '08:00', end: '12:00' }
    ]
  }));
  await Doctor.insertMany(doctors);
  console.log('Doctors created');
};

const createAppointments = async (users) => {
  const patientUsers = users.filter(u => u.role === 'patient');
  const doctorDocs = await Doctor.find();
  const appts = [];
  for (let i = 0; i < 15; i++) {
    const patient = patientUsers[i % patientUsers.length];
    const doctor = doctorDocs[i % doctorDocs.length];
    const date = new Date();
    date.setDate(date.getDate() + (i % 7));
    date.setHours(9 + (i % 5), 0, 0, 0);
    appts.push({ patient: patient._id, doctor: doctor._id, date, durationMinutes: 30, status: 'confirmed' });
  }
  await Appointment.insertMany(appts);
  console.log('Appointments created');
};

const run = async () => {
  try {
    await connect();
    await mongoose.connection.db.dropDatabase();
    const users = await createUsers();
    await createDoctors(users);
    await createAppointments(users);
    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
};

run();

