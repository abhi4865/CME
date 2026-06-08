const jwt      = require('jsonwebtoken');
const Employee = require('../models/Employee');

// ── Verify JWT ────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised — no token' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Employee.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Token user not found' });
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// ── Role guards ───────────────────────────────────────────────────
const isAdmin = (req, res, next) => {
  if (req.user?.role === 'Administrator' || req.user?.role === 'Admin Manager') return next();
  return res.status(403).json({ message: 'Admin access required' });
};

const isMainAdmin = (req, res, next) => {
  if (req.user?.role === 'Administrator') return next();
  return res.status(403).json({ message: 'Main Administrator access required' });
};

module.exports = { protect, isAdmin, isMainAdmin };
