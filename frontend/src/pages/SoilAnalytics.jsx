import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, CheckCircle, AlertTriangle, Printer, Plus, Leaf, Sparkles } from 'lucide-react';
import SoilHealthCardModal from '../components/SoilHealthCardModal';

const SoilAnalytics = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRecord, setActiveRecord] = useState(null);

  const fetchSoilRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get('/soil');
      if (res.data.success) {
        setRecords(res.data.data);
        if (res.data.data.length > 0 && !activeRecord) {
          setActiveRecord(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoilRecords();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="soil-analytics-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-0">Soil Health & NPK Diagnostic Center</h2>
          <small className="text-muted">Automated fertilizer dosage calculator & crop suitability algorithms</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          {activeRecord && (
            <button onClick={handlePrint} className="btn btn-outline-secondary d-flex align-items-center gap-1">
              <Printer size={16} /> Print Health Card
            </button>
          )}
          <button onClick={() => setIsModalOpen(true)} className="btn btn-agri">
            <Plus size={16} /> Test New Soil Sample
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : activeRecord ? (
        <div className="row g-4">
          {/* Main Soil Health Card Display */}
          <div className="col-lg-8">
            <div className="agri-card p-4 shadow-sm border-2" style={{ borderColor: '#05966940' }}>
              <div className="d-flex justify-content-between align-items-start pb-3 border-bottom mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-success text-white p-3 rounded-circle">
                    <Leaf size={28} />
                  </div>
                  <div>
                    <span className="badge bg-success-subtle text-success border border-success-subtle mb-1">
                      Official Soil Diagnostic Card
                    </span>
                    <h4 className="fw-bold mb-0">{activeRecord.plotName}</h4>
                    <small className="text-muted">
                      Sample Recorded: {new Date(activeRecord.sampleDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                    </small>
                  </div>
                </div>

                <div className="text-end">
                  <span className="badge bg-success fs-6 px-3 py-2">
                    {activeRecord.overallHealth} Health
                  </span>
                </div>
              </div>

              {/* Primary Macronutrient Analysis (NPK) */}
              <h6 className="fw-bold mb-3">Macronutrient Test Readings vs Ideal Baselines</h6>
              <div className="row g-3 mb-4">
                {/* Nitrogen */}
                <div className="col-md-4">
                  <div className="p-3 rounded border bg-light">
                    <div className="d-flex justify-content-between text-muted small mb-1">
                      <span>Nitrogen (N)</span>
                      <span>Target: 280</span>
                    </div>
                    <div className="fs-3 fw-bold text-dark font-monospace">{activeRecord.nitrogen} <span className="fs-6 fw-normal text-muted">kg/ha</span></div>
                    <div className="progress mt-2" style={{ height: 6 }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${Math.min(100, (activeRecord.nitrogen / 280) * 100)}%` }}
                      ></div>
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {activeRecord.nitrogen >= 240 ? 'Sufficient' : 'Deficit Detected'}
                    </small>
                  </div>
                </div>

                {/* Phosphorus */}
                <div className="col-md-4">
                  <div className="p-3 rounded border bg-light">
                    <div className="d-flex justify-content-between text-muted small mb-1">
                      <span>Phosphorus (P)</span>
                      <span>Target: 24</span>
                    </div>
                    <div className="fs-3 fw-bold text-dark font-monospace">{activeRecord.phosphorus} <span className="fs-6 fw-normal text-muted">kg/ha</span></div>
                    <div className="progress mt-2" style={{ height: 6 }}>
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: `${Math.min(100, (activeRecord.phosphorus / 24) * 100)}%` }}
                      ></div>
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {activeRecord.phosphorus >= 20 ? 'Optimal' : 'Moderate Need'}
                    </small>
                  </div>
                </div>

                {/* Potassium */}
                <div className="col-md-4">
                  <div className="p-3 rounded border bg-light">
                    <div className="d-flex justify-content-between text-muted small mb-1">
                      <span>Potassium (K)</span>
                      <span>Target: 140</span>
                    </div>
                    <div className="fs-3 fw-bold text-dark font-monospace">{activeRecord.potassium} <span className="fs-6 fw-normal text-muted">kg/ha</span></div>
                    <div className="progress mt-2" style={{ height: 6 }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: `${Math.min(100, (activeRecord.potassium / 140) * 100)}%` }}
                      ></div>
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {activeRecord.potassium >= 120 ? 'Well Balanced' : 'Low Potash'}
                    </small>
                  </div>
                </div>
              </div>

              {/* Chemical Reaction / pH & Organic Carbon */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="p-3 rounded bg-white border">
                    <div className="small text-muted mb-1">Soil Reaction (pH Level)</div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-4 fw-bold font-monospace text-dark">{activeRecord.phLevel}</span>
                      <span className="badge bg-info-subtle text-info border">
                        {activeRecord.phLevel < 6.5 ? 'Acidic' : activeRecord.phLevel > 7.5 ? 'Alkaline' : 'Neutral (Ideal)'}
                      </span>
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                      Target agricultural pH: 6.5 - 7.5
                    </small>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded bg-white border">
                    <div className="small text-muted mb-1">Organic Carbon & Salinity (EC)</div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-4 fw-bold font-monospace text-dark">{activeRecord.organicCarbon || 0.55}% OC</span>
                      <span className="text-muted small">&bull; {activeRecord.electricalConductivity || 0.8} dS/m</span>
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                      Soil microbial activity is favorable
                    </small>
                  </div>
                </div>
              </div>

              {/* Prescribed Fertilizer Dosage Output */}
              <div className="p-3 rounded mb-4" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-2">
                  <Sparkles size={18} />
                  Precision Fertilizer Requirement (Calculated for 1 Acre)
                </h6>
                <div className="row g-2 pt-2">
                  <div className="col-4 text-center border-end">
                    <div className="small text-muted">Neem-Coated Urea</div>
                    <div className="fs-4 fw-bold text-dark font-monospace">{activeRecord.fertilizerDeficit?.ureaNeeded || 28} kg</div>
                    <small className="text-success" style={{ fontSize: '0.75rem' }}>Top dressing</small>
                  </div>
                  <div className="col-4 text-center border-end">
                    <div className="small text-muted">DAP (18:46:0)</div>
                    <div className="fs-4 fw-bold text-dark font-monospace">{activeRecord.fertilizerDeficit?.dapNeeded || 12} kg</div>
                    <small className="text-warning" style={{ fontSize: '0.75rem' }}>Basal application</small>
                  </div>
                  <div className="col-4 text-center">
                    <div className="small text-muted">MOP (Potash)</div>
                    <div className="fs-4 fw-bold text-dark font-monospace">{activeRecord.fertilizerDeficit?.mopNeeded || 8} kg</div>
                    <small className="text-info" style={{ fontSize: '0.75rem' }}>Flowering support</small>
                  </div>
                </div>
              </div>

              {/* Agronomic Recommendation Note */}
              <div className="p-3 rounded bg-light border small text-secondary">
                <strong>Agronomist Advisory: </strong>
                {activeRecord.advisoryNotes || 'Apply 2-3 tonnes of farmyard manure to maintain organic carbon pool. Keep soil moisture around 45% during vegetative tillering.'}
              </div>
            </div>
          </div>

          {/* Right Column: Crop Suitability Matrix & Past History */}
          <div className="col-lg-4">
            {/* Crop Suitability Ranking */}
            <div className="agri-card p-4 mb-4">
              <h5 className="fw-bold mb-1">Crop Suitability Matrix</h5>
              <small className="text-muted mb-3 d-block">Ranked by pH, NPK uptake, and current season</small>

              <div className="d-flex flex-column gap-2">
                {activeRecord.recommendedCrops?.map((crop, idx) => (
                  <div key={idx} className="p-3 rounded border bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark small">{crop.crop}</span>
                      <span className="badge bg-success-subtle text-success fw-bold font-monospace">
                        {crop.suitabilityScore}% Match
                      </span>
                    </div>
                    <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                      {crop.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Test Records History */}
            <div className="agri-card p-4">
              <h6 className="fw-bold mb-3">Saved Test Logs ({records.length})</h6>
              <div className="d-flex flex-column gap-2">
                {records.map((rec) => (
                  <div
                    key={rec._id}
                    onClick={() => setActiveRecord(rec)}
                    className={`p-2 rounded border agri-card-interactive ${rec._id === activeRecord._id ? 'border-success bg-success-subtle' : 'bg-light'}`}
                  >
                    <div className="d-flex justify-content-between align-items-center small">
                      <span className="fw-semibold text-dark">{rec.plotName}</span>
                      <span className="badge bg-secondary font-monospace">pH {rec.phLevel}</span>
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {new Date(rec.sampleDate).toLocaleDateString()} &bull; N: {rec.nitrogen} | P: {rec.phosphorus} | K: {rec.potassium}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="agri-card p-5 text-center text-muted">
          <FileText size={48} className="text-muted mb-3 opacity-50" />
          <h5>No soil health tests recorded yet.</h5>
          <p className="small mb-3">Run an automated diagnostic test to receive tailored fertilizer recommendations.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-agri">
            Run First Soil Analysis
          </button>
        </div>
      )}

      {/* Modal */}
      <SoilHealthCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRecordCreated={(newRec) => {
          fetchSoilRecords();
          setActiveRecord(newRec);
        }}
      />
    </div>
  );
};

export default SoilAnalytics;
