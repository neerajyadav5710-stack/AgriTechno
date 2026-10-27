import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CloudSun,
  Droplets,
  Wind,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Clock,
  Plus,
  Send,
} from 'lucide-react';

const WeatherAdvisory = () => {
  const { user } = useAuth();
  const [district, setDistrict] = useState('Karnal');
  const [state, setState] = useState('Haryana');
  const [weatherData, setWeatherData] = useState(null);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    pestName: '',
    severity: 'High',
    affectedCrops: 'Wheat, Barley',
    symptoms: '',
    preventativeMeasures: 'Avoid excess nitrogen, check early mornings',
    recommendedSprays: 'Propiconazole 25% EC @ 1ml/L',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [wRes, pRes] = await Promise.all([
        api.get(`/weather?district=${district}&state=${state}`),
        api.get('/pest-alerts'),
      ]);

      if (wRes.data.success) setWeatherData(wRes.data);
      if (pRes.data.success) setPestAlerts(pRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [district, state]);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/pest-alerts', {
        ...broadcastForm,
        affectedCrops: broadcastForm.affectedCrops.split(',').map((c) => c.trim()),
        preventativeMeasures: [broadcastForm.preventativeMeasures],
        recommendedSprays: [broadcastForm.recommendedSprays],
        region: { state, district },
      });
      if (res.data.success) {
        setShowBroadcastModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="weather-advisory-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-0">Hyperlocal Weather & Pest Radar</h2>
          <small className="text-muted">7-day agricultural forecasts, spray window advisories, and emergency pest outbreaks</small>
        </div>

        {/* Location selector */}
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="Karnal">Karnal (Haryana)</option>
            <option value="Ludhiana">Ludhiana (Punjab)</option>
            <option value="Hisar">Hisar (Haryana)</option>
            <option value="Indore">Indore (Madhya Pradesh)</option>
            <option value="Nashik">Nashik (Maharashtra)</option>
            <option value="Patna">Patna (Bihar)</option>
          </select>

          {(user?.role === 'admin' || user?.role === 'expert') && (
            <button onClick={() => setShowBroadcastModal(true)} className="btn btn-sm btn-danger d-flex align-items-center gap-1">
              <Plus size={14} /> Broadcast Pest Alert
            </button>
          )}
        </div>
      </div>

      {loading || !weatherData ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <>
          {/* Current Micro-climate & Spray Advisory Box */}
          <div className="agri-card p-4 mb-4" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)', color: 'white' }}>
            <div className="row align-items-center g-4">
              <div className="col-lg-5">
                <span className="badge bg-warning text-dark px-3 py-1 mb-2 fw-bold">Live Sensor Station</span>
                <h3 className="fw-bold mb-1">{weatherData.current.location}</h3>
                <div className="display-4 fw-bold font-monospace mb-2">{weatherData.current.temp}°C</div>
                <div className="text-white-50 small mb-3">
                  Conditions: <strong>{weatherData.current.condition}</strong> &bull; Humidity: <strong>{weatherData.current.humidity}%</strong> &bull; Wind: <strong>{weatherData.current.windSpeed} km/h</strong>
                </div>

                <div className="d-flex gap-3">
                  <div className="small">
                    <span className="text-white-50 d-block">Precipitation Risk</span>
                    <strong className="text-warning">{weatherData.current.rainfallChance}%</strong>
                  </div>
                  <div className="small border-start ps-3 border-white-50">
                    <span className="text-white-50 d-block">Barometric Pressure</span>
                    <strong>{weatherData.current.barometer}</strong>
                  </div>
                  <div className="small border-start ps-3 border-white-50">
                    <span className="text-white-50 d-block">UV Index</span>
                    <strong>{weatherData.current.uvIndex} (Moderate)</strong>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Clock size={18} className="text-warning" />
                    <h6 className="fw-bold mb-0 text-white">Recommended Agro-Chemical Spray Window</h6>
                    <span className="badge bg-success ms-auto">{weatherData.current.sprayWindowScore}</span>
                  </div>
                  <p className="small mb-3 text-light">
                    {weatherData.current.sprayAdvisory}
                  </p>

                  <div className="d-flex align-items-center gap-2 pt-2 border-top border-white-50 small">
                    <CheckCircle size={16} className="text-success" />
                    <span><strong>Irrigation Guidance: </strong>{weatherData.current.irrigationAdvisory}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Grid */}
          <h5 className="fw-bold mb-3">7-Day Agricultural Forecast Horizon</h5>
          <div className="row g-2 mb-4">
            {weatherData.forecast?.map((day, idx) => (
              <div key={idx} className="col-6 col-md-3 col-lg">
                <div className={`p-3 rounded border text-center h-100 ${idx === 0 ? 'bg-success-subtle border-success' : 'bg-white'}`}>
                  <div className="fw-bold small text-dark mb-1">{day.day}</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>{day.date}</div>
                  <CloudSun size={26} className="text-warning my-2" />
                  <div className="fs-5 fw-bold font-monospace text-dark">{day.tempMax}° / <span className="text-muted fs-6">{day.tempMin}°</span></div>
                  <div className="small text-muted mt-1" style={{ fontSize: '0.75rem' }}>{day.condition}</div>
                  <div className="mt-2 pt-2 border-top small" style={{ fontSize: '0.72rem' }}>
                    <Droplets size={12} className="text-info me-1" />
                    Rain: <strong>{day.rainProbability}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Early Warning Pest Outbreak Alerts */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <ShieldAlert size={20} className="text-danger" />
                Active Agricultural Pest & Disease Advisories ({pestAlerts.length})
              </h5>
              <small className="text-muted">Issued by State Krishi Vigyan Kendras (KVK) & ICAR Stations</small>
            </div>
          </div>

          <div className="row g-3">
            {pestAlerts.map((alert) => (
              <div key={alert._id} className="col-lg-6">
                <div className="agri-card p-4 h-100 border-start border-4" style={{ borderLeftColor: alert.severity === 'Severe' || alert.severity === 'High' ? '#dc2626' : '#f59e0b' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className={`badge ${alert.severity === 'Severe' || alert.severity === 'High' ? 'bg-danger' : 'bg-warning text-dark'} mb-1`}>
                        {alert.severity} Risk
                      </span>
                      <h5 className="fw-bold mb-0 text-dark">{alert.title}</h5>
                      <small className="text-muted">Pest: <em>{alert.pestName}</em></small>
                    </div>
                    <span className="badge bg-light text-dark border">
                      {alert.region?.state || 'Northern Region'}
                    </span>
                  </div>

                  <div className="small text-secondary mb-3">
                    <strong>Symptoms: </strong>{alert.symptoms}
                  </div>

                  <div className="p-3 rounded bg-light border mb-3">
                    <div className="fw-semibold small text-danger mb-1">Recommended Control Spray:</div>
                    <ul className="list-unstyled mb-0 small text-dark">
                      {alert.recommendedSprays?.map((spray, sIdx) => (
                        <li key={sIdx} className="d-flex align-items-center gap-1 mb-1">
                          <CheckCircle size={14} className="text-success flex-shrink-0" />
                          <span>{spray}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="small text-muted">
                    <strong>Preventative Cultural Practice: </strong>
                    {alert.preventativeMeasures?.[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Broadcast Modal for Admin/Expert */}
      {showBroadcastModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">Broadcast Emergency Pest Warning</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowBroadcastModal(false)}></button>
              </div>
              <form onSubmit={handleBroadcast}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Alert Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Yellow Rust Outbreak in Wheat"
                      value={broadcastForm.title}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Pest / Pathogen Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Puccinia striiformis"
                        value={broadcastForm.pestName}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, pestName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Severity</label>
                      <select
                        className="form-select"
                        value={broadcastForm.severity}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, severity: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                        <option value="Severe">Severe</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Affected Crops (Comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={broadcastForm.affectedCrops}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, affectedCrops: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Visual Symptoms</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="e.g. Yellow stripe pustules on leaf surface..."
                      value={broadcastForm.symptoms}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, symptoms: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Recommended Fungicide/Insecticide Spray</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Propiconazole 25% EC @ 1ml/L water"
                      value={broadcastForm.recommendedSprays}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, recommendedSprays: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowBroadcastModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger">
                    Broadcast Warning Now
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

export default WeatherAdvisory;
