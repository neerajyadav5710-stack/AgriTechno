import Resource from '../models/Resource.js';
import { getDbStatus } from '../config/db.js';
import { mockData } from '../data/mockStore.js';

// @desc    Get all resources with search & category filters
// @route   GET /api/resources
// @access  Public
export const getResources = async (req, res) => {
  try {
    const { category, search, subsidyOnly } = req.query;

    if (getDbStatus()) {
      let query = { isApproved: true };

      if (category && category !== 'All') {
        query.category = category;
      }
      if (subsidyOnly === 'true') {
        query.subsidyEligible = true;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
        ];
      }

      const resources = await Resource.find(query);
      return res.json({ success: true, count: resources.length, data: resources });
    } else {
      let items = [...mockData.resources];

      if (category && category !== 'All') {
        items = items.filter((r) => r.category.toLowerCase() === category.toLowerCase());
      }
      if (subsidyOnly === 'true') {
        items = items.filter((r) => r.subsidyEligible === true);
      }
      if (search) {
        const s = search.toLowerCase();
        items = items.filter((r) => r.title.toLowerCase().includes(s) || r.brand.toLowerCase().includes(s) || r.description.toLowerCase().includes(s));
      }

      return res.json({ success: true, count: items.length, data: items });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
export const getResourceById = async (req, res) => {
  try {
    if (getDbStatus()) {
      const item = await Resource.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Resource not found' });
      return res.json({ success: true, data: item });
    } else {
      const item = mockData.resources.find((r) => String(r._id) === String(req.params.id));
      if (!item) return res.status(404).json({ success: false, message: 'Resource not found' });
      return res.json({ success: true, data: item });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new marketplace resource (Admin/Seller)
// @route   POST /api/resources
// @access  Private (Admin or Seller)
export const createResource = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (getDbStatus()) {
      const resource = await Resource.create({ ...req.body, seller: userId });
      return res.status(201).json({ success: true, data: resource });
    } else {
      const newRes = {
        _id: 'res_' + Date.now(),
        ...req.body,
        seller: userId,
        isApproved: true,
        createdAt: new Date(),
      };
      mockData.resources.push(newRes);
      return res.status(201).json({ success: true, data: newRes });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
