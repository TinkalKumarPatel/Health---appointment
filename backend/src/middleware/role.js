// No explicit http-errors needed – we send plain JSON status codes

/**
 * Require the authenticated user to have one of the allowed roles.
 * Usage: app.use(requireRole(['admin']))
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
};

