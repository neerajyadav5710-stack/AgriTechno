import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Layers, Plus, MapPin, Droplets, CheckCircle, Edit, Trash2 } from 'lucide-react';

const FarmPlots = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    farmName: '',
    totalArea: '',
    soilType: 'Alluvial',
    irrigationType: 'Drip Irrigation',
    state: 'Haryana',
    district: 'Karnal',
    village: 'Nilokheri',
  });

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/farms');
      if (res.data.success) {
        setFarms(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/farms', {
        farmName: formData.farmName,
        totalArea: Number(formData.totalArea),
        soilType: formData.soilType,
        irrigationType: formData.irrigationType,
        location: {
          state: formData.state,
          district: formData.district,
          village: formData.village,
          latitude: 29.6857,
          longitude: 76.9905,
        },
        plots: [
          { plotName: 'Plot Alpha (East)', area: Number(formData.totalArea) * 0.6, currentCrop: 'Wheat' },
          { plotName: 'Plot Beta (West)', area: Number(formData.totalArea) * 0.4, currentCrop: 'Mustard' },
        ],
      });
      if (res.data.success) {
        setShowAddModal(false);
        fetchFarms();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="farm-plots-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-0">Farm & Plot Management</h2>
          <small className="text-muted">Configure acreage, soil classifications, and plot-level irrigation status</small>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-agri">
          <Plus size={16} /> Register New Farm
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : farms.length > 0 ? (
        farms.map((farm) => (
          <div key={farm._id} className="agri-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 pb-3 border-bottom mb-3">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h4 className="fw-bold mb-0">{farm.farmName}</h4>
                  <span className="badge bg-success">Active Holding</span>
                </div>
                <div className="text-muted small mt-1 d-flex align-items-center gap-1">
                  <MapPin size={14} className="text-danger" />
                  {farm.location?.village}, {farm.location?.district}, {farm.location?.state} (Lat: {farm.location?.latitude || '29.68'}, Lng: {farm.location?.longitude || '76.99'})
                </div>
              </div>

              <div className="d-flex align-items-center gap-3">
                <div className="text-end">
                  <div className="fs-5 fw-bold text-dark font-monospace">{farm.totalArea} Acres</div>
                  <small className="text-muted">{farm.soilType} &bull; {farm.irrigationType}</small>
                </div>
              </div>
            </div>

            {/* Farm Plots Grid */}
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Layers size={18} className="text-success" />
              Subdivided Plots ({farm.plots?.length || 0})
            </h6>

            <div className="row g-3">
              {farm.plots?.map((plot, pIdx) => (
                <div key={plot._id || pIdx} className="col-md-4">
                  <div className="p-3 rounded border bg-light h-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold mb-0 text-dark">{plot.plotName}</h6>
                      <span className={`badge ${plot.soilHealthStatus === 'Optimal' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {plot.soilHealthStatus || 'Optimal'}
                      </span>
                    </div>

                    <div className="small text-muted mb-2">
                      Area: <strong>{plot.area} Acres</strong> &bull; Standing: <span className="text-success fw-bold">{plot.currentCrop}</span>
                    </div>

                    <div className="p-2 rounded bg-white border small mb-2">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-secondary">Root Moisture Index</span>
                        <strong className="text-primary">{plot.moistureIndex || 45}%</strong>
                      </div>
                      <div className="progress" style={{ height: 6 }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${plot.moistureIndex || 45}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between small text-muted">
                      <span>Status: <strong className="text-dark">{plot.irrigationStatus || 'Normal'}</strong></span>
                      <button className="btn btn-sm btn-link text-success p-0 fw-semibold">
                        Diagnostics
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="agri-card p-5 text-center text-muted">
          <Layers size={48} className="text-muted mb-3 opacity-50" />
          <h5>No farm profiles registered yet.</h5>
          <p className="small mb-3">Click below to add your primary farm holding and sub-plots.</p>
          <button onClick={() => setShowAddModal(true)} className="btn btn-agri">
            Register Farm
          </button>
        </div>
      )}

      {/* Add Farm Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">Register New Farm Holding</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleCreateFarm}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Farm Name / Holding Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Kisan Jyoti Krishi Farm"
                      value={formData.farmName}
                      onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Total Area (Acres)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        placeholder="e.g. 5.5"
                        value={formData.totalArea}
                        onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Soil Type</label>
                      <select
                        className="form-select"
                        value={formData.soilType}
                        onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                      >
                        <option value="Alluvial">Alluvial Loam</option>
                        <option value="Black Soil">Black Cotton Soil</option>
                        <option value="Red Soil">Red / Laterite</option>
                        <option value="Sandy Loam">Sandy Loam</option>
                        <option value="Clayey">Clayey Soil</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Primary Irrigation Type</label>
                    <select
                      className="form-select"
                      value={formData.irrigationType}
                      onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                    >
                      <option value="Drip Irrigation">Drip Irrigation</option>
                      <option value="Sprinkler">Sprinkler System</option>
                      <option value="Canal Irrigation">Canal Supply</option>
                      <option value="Tube Well">Solar / Electric Tube Well</option>
                      <option value="Rainfed">Rainfed (Barani)</option>
                    </select>
                  </div>

                  <div className="row g-2">
                    <div className="col-4">
                      <label className="form-label small fw-semibold">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold">District</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Village</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri">
                    Save Farm
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

export default FarmPlots;
