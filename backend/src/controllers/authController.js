import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Register a new user (patient, doctor or admin)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  // Ensure role is valid
  const allowedRoles = ['patient', 'doctor', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password, role });

  const token = generateToken(user._id);
  res.status(201).json({ token, user: { id: user._id, name, email, role } });
});

/**
 * @desc    Login user & get JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);
  res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
});

/**
 * @desc    Get current logged‑in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  // req.user is populated by protect middleware
  res.json({ user: req.user });
});

/**
 * @desc    Placeholder for password‑reset request (email sending not wired yet)
 * @route   POST /api/auth/forgot
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  // In a real app, generate a reset token and email it.
  res.json({ message: 'Password reset link (stub) sent if email exists' });
});

/**
 * @desc    Placeholder for password reset using token
 * @route   POST /api/auth/reset
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  // Stub – accept new password and respond.
  res.json({ message: 'Password has been reset (stub)' });
});

