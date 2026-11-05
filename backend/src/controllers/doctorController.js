import asyncHandler from 'express-async-handler';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Get list of doctors with optional filters
 * @route   GET /api/doctors
 * @access  Public
 */
export const getDoctors = asyncHandler(async (req, res) => {
  const { specialty, name, location, date } = req.query;
  const filter = {};

  if (specialty && specialty.trim()) {
    filter.specialty = { $regex: specialty.trim(), $options: 'i' };
  }
  if (name && name.trim()) {
    filter['user.name'] = { $regex: name.trim(), $options: 'i' };
  }
  if (location && location.trim()) {
    filter.locations = { $elemMatch: { $regex: location.trim(), $options: 'i' } };
  }
  if (date) {
    const day = new Date(date).getDay();
    filter.availability = { $elemMatch: { day } };
  }

  const doctors = await Doctor.find(filter).populate('user', 'name email role');
  res.json(doctors);
});

/**
 * @desc    Get a single doctor profile
 * @route   GET /api/doctors/:id
 * @access  Public
 */
export const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('user', 'name email role');
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  res.json(doctor);
});

/**
 * @desc    Update doctor's availability (doctor only)
 * @route   PUT /api/doctors/:id/availability
 * @access  Private (doctor role)
 */
export const updateAvailability = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  const doctorOwnerId = String(doctor.user?._id || doctor.user);
  if (doctorOwnerId !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden: not owner of profile' });
  }

  const { availability } = req.body;
  doctor.availability = availability;
  await doctor.save();
  res.json({ message: 'Availability updated successfully', availability: doctor.availability });
});
