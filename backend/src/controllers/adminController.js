import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import { memoryDb } from '../data/store.js';
import { isConnectedToMongo } from '../config/db.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/admin/users
 * @access  Private (admin)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  const sanitized = (Array.isArray(users) ? users : []).map(u => ({
    _id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json(sanitized);
});

/**
 * @desc    Update a user's role or details (admin only)
 * @route   PUT /api/admin/users/:id
 * @access  Private (admin)
 */
export const updateUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  await user.save();
  res.json({ message: 'User updated', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

/**
 * @desc    Delete a user (admin only)
 * @route   DELETE /api/admin/users/:id
 * @access  Private (admin)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  if (isConnectedToMongo) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.deleteOne) await user.deleteOne();
  } else {
    const idx = memoryDb.users.findIndex(u => String(u._id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ message: 'User not found' });
    memoryDb.users.splice(idx, 1);
  }
  res.json({ message: 'User removed successfully' });
});

/**
 * @desc    Get all specialties (derived from doctors)
 * @route   GET /api/admin/specialties
 * @access  Private (admin)
 */
export const getSpecialties = asyncHandler(async (req, res) => {
  const specialties = await Doctor.distinct('specialty');
  res.json(specialties);
});

/**
 * @desc    Get all appointments (admin only)
 * @route   GET /api/admin/appointments
 * @access  Private (admin)
 */
export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patient', 'name email')
    .populate('doctor', 'specialty fees locations user')
    .sort({ date: -1 });
  res.json(appointments);
});
