import SoilRecord from '../models/SoilRecord.js';
import Farm from '../models/Farm.js';
import { getDbStatus } from '../config/db.js';
import { mockData } from '../data/mockStore.js';
import { analyzeSoilSample } from '../utils/advisoryEngine.js';

// @desc    Analyze soil sample and generate Soil Health Card
// @route   POST /api/soil/analyze
// @access  Private
export const analyzeAndSaveSoil = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { farmId, plotName, nitrogen, phosphorus, potassium, phLevel, organicCarbon, electricalConductivity } = req.body;

    if (!nitrogen || !phosphorus || !potassium || !phLevel) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Nitrogen (N), Phosphorus (P), Potassium (K), and pH level',
      });
    }

    // Run Advisory Engine
    const analysis = analyzeSoilSample({
      nitrogen,
      phosphorus,
      potassium,
      phLevel,
      organicCarbon,
    });

    if (getDbStatus()) {
      const record = await SoilRecord.create({
        farm: farmId || '65e01a1a1a1a1a1a1a1a0101',
        farmer: userId,
        plotName: plotName || 'Main Plot',
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
        phLevel: Number(phLevel),
        organicCarbon: Number(organicCarbon) || 0.5,
        electricalConductivity: Number(electricalConductivity) || 0.8,
        overallHealth: analysis.overallHealth,
        fertilizerDeficit: analysis.fertilizerDeficit,
        recommendedCrops: analysis.recommendedCrops,
        advisoryNotes: analysis.advisoryNotes,
      });

      // Update plot status if farm exists
      if (farmId) {
        await Farm.updateOne(
          { _id: farmId, 'plots.plotName': plotName },
          { $set: { 'plots.$.soilHealthStatus': analysis.overallHealth } }
        );
      }

      return res.status(201).json({ success: true, data: record });
    } else {
      const newRecord = {
        _id: 'soil_' + Date.now(),
        farm: farmId || '65e01a1a1a1a1a1a1a1a0101',
        farmer: userId,
        plotName: plotName || 'Main Plot',
        sampleDate: new Date(),
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
        phLevel: Number(phLevel),
        organicCarbon: Number(organicCarbon) || 0.5,
        electricalConductivity: Number(electricalConductivity) || 0.8,
        overallHealth: analysis.overallHealth,
        fertilizerDeficit: analysis.fertilizerDeficit,
        recommendedCrops: analysis.recommendedCrops,
        advisoryNotes: analysis.advisoryNotes,
        createdAt: new Date(),
      };
      mockData.soilRecords.unshift(newRecord);
      return res.status(201).json({ success: true, data: newRecord });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's soil records
// @route   GET /api/soil
// @access  Private
export const getSoilRecords = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (getDbStatus()) {
      const query = req.user.role === 'admin' ? {} : { farmer: userId };
      const records = await SoilRecord.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: records.length, data: records });
    } else {
      let records = mockData.soilRecords;
      if (req.user.role !== 'admin') {
        records = records.filter((r) => String(r.farmer) === String(userId));
      }
      return res.json({ success: true, count: records.length, data: records });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
