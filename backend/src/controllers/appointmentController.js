import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Create a new appointment (patient only)
 * @route   POST /api/appointments
 * @access  Private (patient role)
 */
export const createAppointment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { doctorId, date, durationMinutes, notes } = req.body;

  // Verify doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  const start = new Date(date);
  const end = new Date(start.getTime() + (durationMinutes || 30) * 60000);

  const conflict = await Appointment.findOne({
    doctor: doctorId,
    date: { $lt: end },
    status: { $in: ['pending', 'confirmed'] }
  });

  if (conflict && conflict._id) {
    return res.status(400).json({ message: 'Doctor is not available at the selected date/time slot' });
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    date: start,
    durationMinutes: durationMinutes || 30,
    notes: notes || 'General Consultation',
    status: 'confirmed'
  });

  res.status(201).json(appointment);
});

/**
 * @desc    Get appointments for the logged‑in user
 * @route   GET /api/appointments
 * @access  Private
 */
export const getAppointments = asyncHandler(async (req, res) => {
  const role = req.user.role;
  let filter = {};

  if (role === 'patient') {
    filter.patient = req.user._id;
  } else if (role === 'doctor') {
    const docProfile = await Doctor.findOne({ user: req.user._id });
    if (docProfile) {
      filter.doctor = docProfile._id;
    }
  } else if (role === 'admin') {
    filter = {};
  }

  const appointments = await Appointment.find(filter)
    .populate('patient', 'name email')
    .populate('doctor', 'specialty fees locations user')
    .sort({ date: -1 });

  res.json(appointments);
});

/**
 * @desc    Update / Reschedule or change status of an appointment
 * @route   PUT /api/appointments/:id
 * @access  Private
 */
export const updateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  const role = req.user.role;
  const isOwner = String(appointment.patient?._id || appointment.patient) === String(req.user._id);
  const docProfile = await Doctor.findOne({ user: req.user._id });
  const isDoctor = docProfile && String(appointment.doctor?._id || appointment.doctor) === String(docProfile._id);

  if (!(role === 'admin' || isOwner || isDoctor)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { date, durationMinutes, notes, status } = req.body;
  if (date) appointment.date = new Date(date);
  if (durationMinutes) appointment.durationMinutes = durationMinutes;
  if (notes) appointment.notes = notes;
  if (status && ['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    appointment.status = status;
  }

  await appointment.save();
  res.json(appointment);
});

/**
 * @desc    Cancel an appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private (patient owner, doctor or admin)
 */
export const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  const role = req.user.role;
  const isOwner = String(appointment.patient?._id || appointment.patient) === String(req.user._id);
  const docProfile = await Doctor.findOne({ user: req.user._id });
  const isDoctor = docProfile && String(appointment.doctor?._id || appointment.doctor) === String(docProfile._id);

  if (!(role === 'admin' || isOwner || isDoctor)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  appointment.status = 'cancelled';
  await appointment.save();
  res.json({ message: 'Appointment cancelled successfully' });
});
