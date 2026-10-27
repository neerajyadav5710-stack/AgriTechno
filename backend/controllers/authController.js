import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { getDbStatus } from '../config/db.js';
import { mockData } from '../data/mockStore.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'agritechno_secure_secret_token_key_2026_xyz', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, state, district, village, specialization } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    if (getDbStatus()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: role || 'farmer',
        phone: phone || '',
        location: { state: state || 'Haryana', district: district || 'Karnal', village: village || '' },
        specialization: specialization || '',
      });

      return res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          specialization: user.specialization,
          avatar: user.avatar,
        },
      });
    } else {
      // Mock store
      const exists = mockData.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const newUser = {
        _id: 'user_' + Date.now(),
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role: role || 'farmer',
        phone: phone || '',
        location: { state: state || 'Haryana', district: district || 'Karnal', village: village || '' },
        specialization: specialization || '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        createdAt: new Date(),
      };

      mockData.users.push(newUser);

      return res.status(201).json({
        success: true,
        token: generateToken(newUser._id),
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          location: newUser.location,
          specialization: newUser.specialization,
          avatar: newUser.avatar,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (getDbStatus()) {
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      return res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          specialization: user.specialization,
          avatar: user.avatar,
        },
      });
    } else {
      const user = mockData.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      return res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          specialization: user.specialization,
          avatar: user.avatar,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Quick Demo Accounts
// @route   GET /api/auth/demo-users
// @access  Public
export const getDemoUsers = (req, res) => {
  res.json({
    success: true,
    demoUsers: [
      {
        role: 'farmer',
        name: 'Ramesh Kumar (Farmer)',
        email: 'ramesh@agritechno.com',
        password: 'farmer123',
        description: 'Access farm plots, soil health analytics, crop cycles, and marketplace.',
      },
      {
        role: 'expert',
        name: 'Dr. Anita Sharma (Agri Expert)',
        email: 'anita@agritechno.com',
        password: 'expert123',
        description: 'Provide agronomy solutions, answer farm consultation tickets.',
      },
      {
        role: 'admin',
        name: 'Neeraj Yadav (Administrator)',
        email: 'admin@agritechno.com',
        password: 'admin123',
        description: 'Manage users, approve resources, broadcast emergency pest warnings.',
      },
    ],
  });
};
