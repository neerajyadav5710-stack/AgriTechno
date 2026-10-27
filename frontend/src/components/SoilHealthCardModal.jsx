import React, { useState } from 'react';
import api from '../services/api';
import { FileText, CheckCircle2, AlertTriangle, ArrowRight, X } from 'lucide-react';

const SoilHealthCardModal = ({ isOpen, onClose, farmId, onRecordCreated }) => {
  const [formData, setFormData] = useState({
    plotName: 'Main Plot',
    nitrogen: 240,
    phosphorus: 18,
    potassium: 130,
    phLevel: 7.2,
    organicCarbon: 0.55,
    electricalConductivity: 0.75,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/soil/analyze', {
        ...formData,
        farmId,
      });

      if (res.data.success) {
        setResult(res.data.data);
        if (onRecordCreated) onRecordCreated(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error running soil test analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header text-white" style={{ backgroundColor: '#065f46' }}>
            <div className="d-flex align-items-center gap-2">
              <FileText size={22} className="text-warning" />
              <div>
                <h5 className="modal-title fw-bold mb-0">Precision Soil Health Card Generator</h5>
                <small className="text-white-50">Automated NPK Deficit & Crop Suitability Algorithm</small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>

          <div className="modal-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}

            {!result ? (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Target Farm Plot</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.plotName}
                      onChange={(e) => setFormData({ ...formData, plotName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Soil pH Level (1.0 - 14.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={formData.phLevel}
                      onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}
                      required
                    />
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>Ideal range: 6.5 - 7.5</small>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">Available Nitrogen (N kg/ha)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.nitrogen}
                      onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                      required
                    />
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>Standard Target: 280 kg/ha</small>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">Available Phosphorus (P kg/ha)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.phosphorus}
                      onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                      required
                    />
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>Standard Target: 24 kg/ha</small>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">Available Potassium (K kg/ha)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.potassium}
                      onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                      required
                    />
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>Standard Target: 140 kg/ha</small>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Organic Carbon (OC %)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.organicCarbon}
                      onChange={(e) => setFormData({ ...formData, organicCarbon: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Electrical Conductivity (EC dS/m)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.electricalConductivity}
                      onChange={(e) => setFormData({ ...formData, electricalConductivity: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-agri">
                    {loading ? 'Running Soil Diagnostics...' : 'Generate Soil Health Card'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {/* Result Overview */}
                <div className="p-3 mb-4 rounded border" style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="badge bg-success mb-1">Status: {result.overallHealth}</span>
                      <h4 className="fw-bold mb-0 text-success">Soil Diagnostic Report Ready</h4>
                      <small className="text-muted">Plot: {result.plotName} &bull; Sample Date: {new Date(result.sampleDate).toLocaleDateString()}</small>
                    </div>
                    <div className="text-end font-monospace">
                      <div className="fs-5 fw-bold text-dark">pH {result.phLevel}</div>
                      <small className="text-muted">EC: {result.electricalConductivity} dS/m</small>
                    </div>
                  </div>
                </div>

                {/* Fertilizer Dosage Needed */}
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <CheckCircle2 size={18} className="text-success" />
                  Prescribed Fertilizer Dosage (Per Acre)
                </h6>
                <div className="row g-2 mb-4">
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-light rounded text-center border">
                      <div className="small text-muted">Urea (46% N)</div>
                      <div className="fs-4 fw-bold text-primary font-monospace">{result.fertilizerDeficit?.ureaNeeded || 0} kg</div>
                      <small className="text-muted">per acre</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-light rounded text-center border">
                      <div className="small text-muted">DAP (18:46:0)</div>
                      <div className="fs-4 fw-bold text-warning font-monospace">{result.fertilizerDeficit?.dapNeeded || 0} kg</div>
                      <small className="text-muted">per acre</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-light rounded text-center border">
                      <div className="small text-muted">MOP (60% K2O)</div>
                      <div className="fs-4 fw-bold text-info font-monospace">{result.fertilizerDeficit?.mopNeeded || 0} kg</div>
                      <small className="text-muted">per acre</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-light rounded text-center border">
                      <div className="small text-muted">Soil Amendment</div>
                      <div className="fs-4 fw-bold text-secondary font-monospace">
                        {(result.fertilizerDeficit?.gypsumNeeded || result.fertilizerDeficit?.limeNeeded) ? `${result.fertilizerDeficit?.gypsumNeeded || result.fertilizerDeficit?.limeNeeded} kg` : 'None'}
                      </div>
                      <small className="text-muted">{result.fertilizerDeficit?.gypsumNeeded ? 'Gypsum' : result.fertilizerDeficit?.limeNeeded ? 'Lime' : 'Balanced'}</small>
                    </div>
                  </div>
                </div>

                {/* Crop Suitability Matrix */}
                <h6 className="fw-bold mb-3">Instant Crop Suitability Ranking</h6>
                <div className="list-group mb-4">
                  {result.recommendedCrops?.slice(0, 4).map((crop, idx) => (
                    <div key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{crop.crop} <span className="badge bg-secondary ms-2">{crop.season}</span></div>
                        <small className="text-muted">{crop.reason}</small>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-success-subtle text-success fs-6 fw-bold px-3 py-1">
                          {crop.suitabilityScore}% Match
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Agronomist Advisory Note */}
                <div className="p-3 rounded bg-light border small text-secondary mb-4">
                  <strong>Advisory Note: </strong>
                  {result.advisoryNotes}
                </div>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-outline-secondary" onClick={() => setResult(null)}>
                    Test Another Sample
                  </button>
                  <button className="btn btn-agri" onClick={onClose}>
                    Done & Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilHealthCardModal;
