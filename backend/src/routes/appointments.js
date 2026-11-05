import express from 'express';
import { body, param } from 'express-validator';
import {
  createAppointment,
  getAppointments,
  updateAppointment,
  cancelAppointment
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

// Patient creates an appointment
router.post(
  '/',
  protect,
  requireRole(['patient']),
  [
    body('doctorId').isMongoId(),
    body('date').isISO8601(),
    body('durationMinutes').optional().isInt({ min: 15, max: 180 }),
    body('notes').optional().isString()
  ],
  createAppointment
);

// Get appointments for logged‑in user (patient/doctor/admin)
router.get('/', protect, getAppointments);

// Update (reschedule) – patient only
router.put(
  '/:id',
  protect,
  requireRole(['patient']),
  [param('id').isMongoId()],
  updateAppointment
);

// Cancel – patient, doctor, admin
router.delete(
  '/:id',
  protect,
  [param('id').isMongoId()],
  cancelAppointment
);

export default router;

