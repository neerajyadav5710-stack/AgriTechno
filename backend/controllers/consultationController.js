import Consultation from '../models/Consultation.js';
import { getDbStatus } from '../config/db.js';
import { mockData } from '../data/mockStore.js';

// @desc    Get consultations (Farmer gets own, Expert/Admin gets all)
// @route   GET /api/consultations
// @access  Private
export const getConsultations = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (getDbStatus()) {
      let query = {};
      if (req.user.role === 'farmer') {
        query = { farmer: userId };
      }
      const list = await Consultation.find(query)
        .populate('farmer', 'name email phone location')
        .populate('assignedExpert', 'name email specialization')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: list.length, data: list });
    } else {
      let list = mockData.consultations;
      if (req.user.role === 'farmer') {
        list = list.filter((c) => String(c.farmer) === String(userId));
      }
      return res.json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new consultation ticket
// @route   POST /api/consultations
// @access  Private
export const createConsultation = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { cropName, issueTitle, description, urgency, imageUrl } = req.body;

    if (!cropName || !issueTitle || !description) {
      return res.status(400).json({ success: false, message: 'Crop name, issue title and description are required' });
    }

    if (getDbStatus()) {
      const ticket = await Consultation.create({
        farmer: userId,
        cropName,
        issueTitle,
        description,
        urgency: urgency || 'Routine',
        imageUrl: imageUrl || '',
        status: 'Open',
        responses: [],
      });
      return res.status(201).json({ success: true, data: ticket });
    } else {
      const newTicket = {
        _id: 'cons_' + Date.now(),
        farmer: userId,
        farmerName: req.user.name,
        cropName,
        issueTitle,
        description,
        urgency: urgency || 'Routine',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
        status: 'Open',
        responses: [],
        createdAt: new Date(),
      };
      mockData.consultations.unshift(newTicket);
      return res.status(201).json({ success: true, data: newTicket });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Expert or Farmer replies to consultation ticket
// @route   POST /api/consultations/:id/respond
// @access  Private
export const respondToConsultation = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { message, actionSteps, newStatus } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (getDbStatus()) {
      const ticket = await Consultation.findById(req.params.id);
      if (!ticket) return res.status(404).json({ success: false, message: 'Consultation ticket not found' });

      ticket.responses.push({
        responder: userId,
        responderName: req.user.name,
        role: req.user.role,
        message,
        actionSteps: actionSteps || [],
      });

      if (newStatus) {
        ticket.status = newStatus;
      } else if (req.user.role === 'expert') {
        ticket.status = 'Resolved';
        ticket.assignedExpert = userId;
      }

      await ticket.save();
      return res.json({ success: true, data: ticket });
    } else {
      const ticket = mockData.consultations.find((c) => String(c._id) === String(req.params.id));
      if (!ticket) return res.status(404).json({ success: false, message: 'Consultation ticket not found' });

      ticket.responses.push({
        _id: 'resp_' + Date.now(),
        responder: userId,
        responderName: req.user.name,
        role: req.user.role,
        message,
        actionSteps: actionSteps || [],
        createdAt: new Date(),
      });

      if (newStatus) {
        ticket.status = newStatus;
      } else if (req.user.role === 'expert') {
        ticket.status = 'Resolved';
      }

      return res.json({ success: true, data: ticket });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
