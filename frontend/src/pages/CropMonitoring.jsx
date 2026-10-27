import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Sprout, Plus, CheckCircle, Calendar, TrendingUp, AlertCircle, Trash2, Edit3 } from 'lucide-react';

const CropMonitoring = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    cropName: 'Wheat (HD-2967)',
    variety: 'Certified High-Yield',
    season: 'Rabi',
    plotName: 'Plot Alpha',
    targetYield: 24,
    stage: 'Vegetative',
    notes: '',
  });

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const [cropsRes, farmsRes] = await Promise.all([api.get('/crops'), api.get('/farms')]);
      if (cropsRes.data.success) setCrops(cropsRes.data.data);
      if (farmsRes.data.success) setFarms(farmsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleAddCrop = async (e) => {
    e.preventDefault();
    try {
      const activeFarmId = farms[0]?._id;
      const res = await api.post('/crops', {
        ...formData,
        farmId: activeFarmId,
      });
      if (res.data.success) {
        setShowAddModal(false);
        fetchCrops();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStage = async (cropId, newStage) => {
    try {
      await api.put(`/crops/${cropId}`, { stage: newStage });
      fetchCrops();
    } catch (err) {
      console.error(err);
    }
  };

  const stages = [
    'Germination',
    'Vegetative',
    'Tillering/Branching',
    'Flowering',
    'Grain Filling',
    'Maturity/Harvest',
  ];

  return (
    <div className="crop-monitoring-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-0">Crop Lifecycle & Yield Monitoring</h2>
          <small className="text-muted">Track phenological growth stages, scheduled nutrient doses, and expected harvests</small>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-agri">
          <Plus size={16} /> Track New Crop
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : crops.length > 0 ? (
        <div className="row g-4">
          {crops.map((crop) => (
            <div key={crop._id} className="col-lg-6">
              <div className="agri-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h4 className="fw-bold mb-0">{crop.cropName}</h4>
                      <span className="badge bg-secondary">{crop.season} Season</span>
                    </div>
                    <small className="text-muted">
                      {crop.plotName} &bull; Variety: <strong>{crop.variety}</strong>
                    </small>
                  </div>
                  <span className={`badge ${crop.healthStatus === 'Excellent' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {crop.healthStatus}
                  </span>
                </div>

                {/* Growth Stage Stepper / Progress */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span className="fw-semibold text-dark">Current Stage: <span className="text-success">{crop.stage}</span></span>
                    <span>Advance Stage:</span>
                  </div>
                  <div className="d-flex gap-1 mb-2">
                    {stages.map((st, sIdx) => {
                      const currentIdx = stages.indexOf(crop.stage);
                      const isDone = sIdx <= currentIdx;
                      return (
                        <div
                          key={sIdx}
                          onClick={() => handleUpdateStage(crop._id, st)}
                          className="flex-fill text-center p-1 rounded agri-card-interactive"
                          style={{
                            backgroundColor: isDone ? '#059669' : '#e2e8f0',
                            color: isDone ? 'white' : '#64748b',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                          }}
                          title={`Click to set stage to ${st}`}
                        >
                          {st.split('/')[0]}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sowing & Yield Metrics */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="p-2 rounded bg-light border small">
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>Sowing Date</div>
                      <strong className="text-dark">{new Date(crop.sowingDate).toLocaleDateString()}</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded bg-light border small">
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>Est. Harvest</div>
                      <strong className="text-dark">{new Date(crop.expectedHarvestDate).toLocaleDateString()}</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded bg-light border small">
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>Target Yield</div>
                      <strong className="text-success">{crop.targetYield} Quintals / Acre</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded bg-light border small">
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>Projected Yield</div>
                      <strong className="text-primary">{crop.currentEstimatedYield || crop.targetYield} Quintals</strong>
                    </div>
                  </div>
                </div>

                {/* Fertilizer Application Schedule */}
                <h6 className="fw-bold mb-2 small text-dark d-flex align-items-center gap-1">
                  <Calendar size={14} className="text-success" /> Nutrient Application Schedule
                </h6>
                <div className="d-flex flex-column gap-1 mb-3">
                  {crop.fertilizerSchedule?.map((sched, sIdx) => (
                    <div key={sIdx} className="d-flex justify-content-between align-items-center p-2 rounded bg-light border small" style={{ fontSize: '0.75rem' }}>
                      <div>
                        <strong>{sched.stageName}</strong>: {sched.fertilizerName} ({sched.dosage})
                      </div>
                      <span className={`badge ${sched.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {sched.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Agronomic Observation Notes */}
                {crop.notes && (
                  <div className="p-2 rounded bg-light border small text-muted" style={{ fontSize: '0.75rem' }}>
                    <strong>Observation:</strong> {crop.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="agri-card p-5 text-center text-muted">
          <Sprout size={48} className="text-muted mb-3 opacity-50" />
          <h5>No standing crops recorded.</h5>
          <p className="small mb-3">Add your current wheat, mustard, paddy, or vegetable plots to start lifecycle tracking.</p>
          <button onClick={() => setShowAddModal(true)} className="btn btn-agri">
            Track New Crop
          </button>
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">Track New Crop Cycle</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddCrop}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Crop Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Wheat (HD-2967), Basmati Rice, Mustard"
                      value={formData.cropName}
                      onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Seed Variety</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Pusa Bold / HD-3086"
                        value={formData.variety}
                        onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Season</label>
                      <select
                        className="form-select"
                        value={formData.season}
                        onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      >
                        <option value="Rabi">Rabi (Winter)</option>
                        <option value="Kharif">Kharif (Monsoon)</option>
                        <option value="Zaid">Zaid (Summer)</option>
                        <option value="Perennial">Perennial</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Target Plot</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.plotName}
                        onChange={(e) => setFormData({ ...formData, plotName: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Target Yield (Qtl/Acre)</label>
                      <input
                        type="number"
                        step="0.5"
                        className="form-control"
                        value={formData.targetYield}
                        onChange={(e) => setFormData({ ...formData, targetYield: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Current Growth Stage</label>
                    <select
                      className="form-select"
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    >
                      {stages.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Field Observation Notes</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Notes on seed treatment, germination %, or basal fertilizer..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri">
                    Save Crop Cycle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropMonitoring;
