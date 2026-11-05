import express from 'express';
import { query, param, body } from 'express-validator';
import { getDoctors, getDoctorById, updateAvailability } from '../controllers/doctorController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

// Public: list and filter doctors
router.get(
  '/',
  [
    query('specialty').optional().isString(),
    query('name').optional().isString(),
    query('location').optional().isString(),
    query('date').optional().isISO8601()
  ],
  getDoctors
);

// Public: get doctor profile
router.get('/:id', [param('id').isMongoId()], getDoctorById);

// Private: doctor updates own availability
router.put(
  '/:id/availability',
  protect,
  requireRole(['doctor']),
  [
    param('id').isMongoId(),
    body('availability').isArray({ min: 1 })
  ],
  updateAvailability
);

export default router;

