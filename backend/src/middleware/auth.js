import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: '../../.env' });

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * Middleware to protect routes – validates JWT and attaches the user object to req.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach minimal user info (id, role) – fetch full doc if needed later.
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * Generate a JWT for a user.
 */
export const generateToken = (userId) => {
  const expiresIn = process.env.TOKEN_EXPIRES_IN || '1d';
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn });
};

