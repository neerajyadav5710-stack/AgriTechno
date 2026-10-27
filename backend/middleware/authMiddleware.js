import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDbStatus } from '../config/db.js';
import { mockData } from '../data/mockStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agritechno_secure_secret_token_key_2026_xyz');

    if (getDbStatus()) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      const user = mockData.users.find((u) => u._id === decoded.id);
      if (user) {
        const { password, ...rest } = user;
        req.user = rest;
      }
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
