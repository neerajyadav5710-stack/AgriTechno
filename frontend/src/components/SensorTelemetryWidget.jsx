import React, { useState } from 'react';
import { Cpu, Droplet, Thermometer, Wind, Zap, Play, Check } from 'lucide-react';
import api from '../services/api';

const SensorTelemetryWidget = ({ farmId, telemetry = {}, onUpdated }) => {
  const [moisture, setMoisture] = useState(telemetry.soilMoisture || 42);
  const [temp, setTemp] = useState(telemetry.soilTemp || 23.5);
  const [ambientTemp, setAmbientTemp] = useState(telemetry.ambientTemp || 27.5);
  const [humidity, setHumidity] = useState(telemetry.ambientHumidity || 58);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const triggerSimulation = async (type) => {
    let newM = moisture;
    let newT = temp;
    let newAmb = ambientTemp;
    let newH = humidity;

    if (type === 'rain') {
      newM = Math.min(85, newM + 25);
      newH = Math.min(92, newH + 20);
      newAmb = Math.max(18, newAmb - 4);
    } else if (type === 'dry') {
      newM = Math.max(18, newM - 20);
      newAmb = Math.min(38, newAmb + 5);
      newH = Math.max(30, newH - 15);
    } else if (type === 'irrigate') {
      newM = 65;
    }

    setMoisture(newM);
    setTemp(newT);
    setAmbientTemp(newAmb);
    setHumidity(newH);

    if (farmId) {
      try {
        setUpdating(true);
        await api.post(`/farms/${farmId}/telemetry`, {
          soilMoisture: newM,
          soilTemp: newT,
          ambientTemp: newAmb,
          ambientHumidity: newH,
        });
        setSuccessMsg(`Simulated: ${type.toUpperCase()} applied!`);
        setTimeout(() => setSuccessMsg(''), 2500);
        if (onUpdated) onUpdated();
      } catch (err) {
        console.error(err);
      } finally {
        setUpdating(false);
      }
    }
  };

  // Determine irrigation advice
  let advice = { status: 'Optimal', text: 'Moisture level is well within root zone retention capacity.', color: 'text-success' };
  if (moisture < 30) {
    advice = { status: 'Irrigation Needed', text: 'Critical moisture deficit! Trigger drip valves for 45 minutes.', color: 'text-danger' };
  } else if (moisture > 75) {
    advice = { status: 'Waterlogged', text: 'Excess moisture detected. Clear peripheral drainage furrows.', color: 'text-warning' };
  }

  return (
    <div className="agri-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-light p-2 rounded-circle text-primary">
            <Cpu size={20} className="text-success" />
          </div>
          <div>
            <h6 className="mb-0 fw-bold">Live IoT Sensor Telemetry</h6>
            <small className="text-muted">Node ID: AGT-SENSOR-704 &bull; Sync: Realtime</small>
          </div>
        </div>
        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
          Active Feed
        </span>
      </div>

      {/* 4 Sensor Gauges */}
      <div className="row g-2 mb-3">
        <div className="col-6 col-md-3">
          <div className="p-3 rounded bg-light border text-center">
            <Droplet size={20} className="text-primary mb-1" />
            <div className="text-muted small">Soil Moisture</div>
            <div className="fs-4 fw-bold font-monospace text-dark">{moisture}%</div>
            <div className="progress mt-2" style={{ height: 6 }}>
              <div
                className={`progress-bar ${moisture < 30 ? 'bg-danger' : moisture > 70 ? 'bg-warning' : 'bg-primary'}`}
                style={{ width: `${moisture}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 rounded bg-light border text-center">
            <Thermometer size={20} className="text-danger mb-1" />
            <div className="text-muted small">Soil Temp</div>
            <div className="fs-4 fw-bold font-monospace text-dark">{temp}°C</div>
            <small className="text-success" style={{ fontSize: '0.72rem' }}>Normal Root Range</small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 rounded bg-light border text-center">
            <Thermometer size={20} className="text-warning mb-1" />
            <div className="text-muted small">Ambient Air</div>
            <div className="fs-4 fw-bold font-monospace text-dark">{ambientTemp}°C</div>
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>Canopy Level</small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 rounded bg-light border text-center">
            <Wind size={20} className="text-info mb-1" />
            <div className="text-muted small">RH Humidity</div>
            <div className="fs-4 fw-bold font-monospace text-dark">{humidity}%</div>
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>RH Sensor</small>
          </div>
        </div>
      </div>

      {/* Advisory Bar */}
      <div className="p-2 rounded bg-light border d-flex align-items-center justify-content-between mb-3">
        <div className="small">
          <span className={`fw-bold me-2 ${advice.color}`}>[{advice.status}]</span>
          <span className="text-secondary">{advice.text}</span>
        </div>
        {successMsg && <span className="badge bg-success text-white animate-fade"><Check size={12} className="me-1" />{successMsg}</span>}
      </div>

      {/* Interactive Telemetry Simulator Controls */}
      <div className="pt-2 border-top">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <span className="small text-muted fw-semibold">
            <Zap size={14} className="text-warning me-1" />
            IoT Simulator Controls:
          </span>
          <div className="btn-group btn-group-sm">
            <button
              onClick={() => triggerSimulation('rain')}
              disabled={updating}
              className="btn btn-outline-primary"
              title="Simulate sudden rainfall"
            >
              Simulate Rain (+25%)
            </button>
            <button
              onClick={() => triggerSimulation('dry')}
              disabled={updating}
              className="btn btn-outline-warning"
              title="Simulate dry spell / drought"
            >
              Simulate Dry Spell (-20%)
            </button>
            <button
              onClick={() => triggerSimulation('irrigate')}
              disabled={updating}
              className="btn btn-outline-success"
              title="Simulate automated drip irrigation cycle"
            >
              Trigger Drip Irrigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorTelemetryWidget;
