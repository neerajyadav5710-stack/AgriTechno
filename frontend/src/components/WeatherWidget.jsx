import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CloudSun, Droplets, Wind, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

const WeatherWidget = ({ district = 'Karnal', state = 'Haryana' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/weather?district=${district}&state=${state}`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Weather fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [district, state]);

  if (loading) {
    return (
      <div className="agri-card p-4 text-center">
        <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
        <span className="text-muted small">Loading Hyperlocal Agro-Weather...</span>
      </div>
    );
  }

  if (!data) return null;

  const { current } = data;

  return (
    <div className="agri-card p-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white' }}>
      {/* Background soft glow decoration */}
      <div className="position-absolute end-0 top-0 translate-middle-y opacity-10" style={{ pointerEvents: 'none' }}>
        <CloudSun size={180} />
      </div>

      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <span className="badge bg-warning text-dark px-2 py-1 mb-1 fw-bold">Live Micro-Climate</span>
          <h5 className="mb-0 fw-bold">{current.location}</h5>
          <small className="text-white-50">{current.condition}</small>
        </div>
        <button onClick={fetchWeather} className="btn btn-sm btn-link text-white-50 p-0 hover-white" title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="row align-items-center g-3 my-2">
        <div className="col-auto">
          <div className="display-5 fw-bold font-monospace">{current.temp}°C</div>
          <small className="text-white-50">Feels like {current.feelsLike}°C</small>
        </div>
        <div className="col border-start ps-3 border-white-50">
          <div className="d-flex align-items-center gap-2 mb-1 small">
            <Droplets size={16} className="text-info" />
            <span>Humidity: <strong>{current.humidity}%</strong></span>
          </div>
          <div className="d-flex align-items-center gap-2 mb-1 small">
            <Wind size={16} className="text-warning" />
            <span>Wind: <strong>{current.windSpeed} km/h ({current.windDirection})</strong></span>
          </div>
          <div className="d-flex align-items-center gap-2 small">
            <CloudSun size={16} className="text-light" />
            <span>Rain Risk: <strong>{current.rainfallChance}%</strong></span>
          </div>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="mt-3 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <div className="d-flex align-items-center gap-2 mb-1">
          <CheckCircle2 size={16} className="text-warning" />
          <span className="fw-semibold small">Spray Window: {current.sprayWindowScore}</span>
        </div>
        <p className="mb-0 small text-white-50" style={{ fontSize: '0.78rem' }}>
          {current.sprayAdvisory}
        </p>
      </div>
    </div>
  );
};

export default WeatherWidget;
