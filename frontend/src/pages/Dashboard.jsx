import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import WeatherWidget from '../components/WeatherWidget';
import SensorTelemetryWidget from '../components/SensorTelemetryWidget';
import SoilHealthCardModal from '../components/SoilHealthCardModal';
import {
  Sprout,
  Activity,
  Layers,
  Droplets,
  AlertTriangle,
  FileText,
  PlusCircle,
  ShoppingBag,
  Stethoscope,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [farmsRes, cropsRes, alertsRes] = await Promise.all([
        api.get('/farms'),
        api.get('/crops'),
        api.get('/pest-alerts'),
      ]);

      if (farmsRes.data.success) setFarms(farmsRes.data.data);
      if (cropsRes.data.success) setCrops(cropsRes.data.data);
      if (alertsRes.data.success) setPestAlerts(alertsRes.data.data);
    } catch (err) {
      console.error('Dashboard load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activeFarm = farms[0] || null;
  const totalAcres = farms.reduce((sum, f) => sum + (f.totalArea || 0), 0);
  const totalPlots = farms.reduce((sum, f) => sum + (f.plots?.length || 0), 0);

  return (
    <div className="dashboard-page">
      {/* Top Banner / Welcome */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 mb-1">
            Precision Ag-OS 2026
          </span>
          <h2 className="fw-bold mb-0 text-dark">
            {t.dashboard.welcome}, {user?.name}
          </h2>
          <small className="text-muted">
            {activeFarm ? `${activeFarm.farmName} &bull; ${activeFarm.location?.district}, ${activeFarm.location?.state}` : 'Farm Command Center'}
          </small>
        </div>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => setIsSoilModalOpen(true)}
            className="btn btn-agri shadow-sm"
          >
            <FileText size={16} />
            {t.dashboard.testSoil}
          </button>
          <Link to="/crops" className="btn btn-outline-secondary">
            <PlusCircle size={16} />
            {t.dashboard.addCrop}
          </Link>
        </div>
      </div>

      {/* Emergency Pest Alert Marquee / Banner if High severity alerts exist */}
      {pestAlerts.length > 0 && (
        <div className="alert alert-warning border-warning d-flex align-items-center justify-content-between py-2 px-3 mb-4">
          <div className="d-flex align-items-center gap-2 small">
            <AlertTriangle size={18} className="text-danger flex-shrink-0" />
            <span>
              <strong>Pest Advisory Alert:</strong> {pestAlerts[0].title} in {pestAlerts[0].region?.state || 'Northern Region'}.
            </span>
          </div>
          <Link to="/weather" className="btn btn-sm btn-outline-dark py-0" style={{ fontSize: '0.78rem' }}>
            View Action Protocol
          </Link>
        </div>
      )}

      {/* Metric Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2 small">
              <span>{t.dashboard.totalAcreage}</span>
              <Layers size={18} className="text-success" />
            </div>
            <div className="fs-3 fw-bold text-dark font-monospace">{totalAcres || 7.5}</div>
            <small className="text-success fw-semibold" style={{ fontSize: '0.75rem' }}>
              Across {totalPlots || 3} Plots
            </small>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2 small">
              <span>{t.dashboard.healthyCrops}</span>
              <Sprout size={18} className="text-primary" />
            </div>
            <div className="fs-3 fw-bold text-dark font-monospace">{crops.length || 2} Active</div>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              Wheat, Mustard
            </small>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2 small">
              <span>Soil Health Status</span>
              <Activity size={18} className="text-info" />
            </div>
            <div className="fs-3 fw-bold text-success font-monospace">Optimal</div>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              pH 7.2 Balanced
            </small>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2 small">
              <span>Moisture Status</span>
              <Droplets size={18} className="text-warning" />
            </div>
            <div className="fs-3 fw-bold text-dark font-monospace">
              {activeFarm?.sensorTelemetry?.soilMoisture || 46}%
            </div>
            <small className="text-success" style={{ fontSize: '0.75rem' }}>
              Retention Adequate
            </small>
          </div>
        </div>
      </div>

      {/* Row 2: Weather and IoT Telemetry Widgets */}
      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <WeatherWidget district={activeFarm?.location?.district || 'Karnal'} state={activeFarm?.location?.state || 'Haryana'} />
        </div>
        <div className="col-lg-7">
          <SensorTelemetryWidget
            farmId={activeFarm?._id}
            telemetry={activeFarm?.sensorTelemetry}
            onUpdated={fetchDashboardData}
          />
        </div>
      </div>

      {/* Row 3: Active Crops and Quick Precision Shortcuts */}
      <div className="row g-4">
        {/* Crops List */}
        <div className="col-lg-8">
          <div className="agri-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-0">Active Crop Cycles</h5>
                <small className="text-muted">Lifecycle stage and estimated yield tracking</small>
              </div>
              <Link to="/crops" className="btn btn-sm btn-link text-success p-0 fw-semibold">
                Manage Crops <ChevronRight size={16} />
              </Link>
            </div>

            <div className="row g-3">
              {crops.length > 0 ? (
                crops.map((crop) => (
                  <div key={crop._id} className="col-md-6">
                    <div className="p-3 rounded border bg-light">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{crop.cropName}</h6>
                          <small className="text-muted">{crop.plotName} &bull; {crop.variety}</small>
                        </div>
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          {crop.stage}
                        </span>
                      </div>

                      <div className="small text-muted mb-2">
                        Est. Yield: <strong>{crop.targetYield} qtl/acre</strong>
                      </div>

                      <div className="progress mb-2" style={{ height: 6 }}>
                        <div
                          className="progress-bar bg-success"
                          style={{
                            width: crop.stage === 'Tillering/Branching' ? '45%' : crop.stage === 'Flowering' ? '65%' : '80%',
                          }}
                        ></div>
                      </div>

                      <div className="d-flex justify-content-between small text-muted" style={{ fontSize: '0.75rem' }}>
                        <span>Sown: {new Date(crop.sowingDate).toLocaleDateString()}</span>
                        <span>Harvest: {new Date(crop.expectedHarvestDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-4 text-muted">
                  No crops logged yet. Click "Track New Crop" to add your field records.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Hub Navigation Cards */}
        <div className="col-lg-4">
          <div className="agri-card p-4 h-100">
            <h5 className="fw-bold mb-3">Precision Hub Shortcuts</h5>
            <div className="d-flex flex-column gap-2">
              <Link to="/soil-analytics" className="p-3 rounded border bg-light agri-card-interactive d-flex align-items-center gap-3">
                <div className="bg-success text-white p-2 rounded">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="fw-bold small text-dark">Soil Health & NPK Calculator</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Automate Urea, DAP, and MOP dosages</div>
                </div>
              </Link>

              <Link to="/marketplace" className="p-3 rounded border bg-light agri-card-interactive d-flex align-items-center gap-3">
                <div className="bg-warning text-white p-2 rounded">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <div className="fw-bold small text-dark">Krishi Store & Subsidies</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Buy certified seeds & solar drip kits</div>
                </div>
              </Link>

              <Link to="/ask-doctor" className="p-3 rounded border bg-light agri-card-interactive d-flex align-items-center gap-3">
                <div className="bg-danger text-white p-2 rounded">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <div className="fw-bold small text-dark">Consult Agri-Doctor</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Upload crop leaf photos for diagnosis</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Soil Health Card Modal */}
      <SoilHealthCardModal
        isOpen={isSoilModalOpen}
        onClose={() => setIsSoilModalOpen(false)}
        farmId={activeFarm?._id}
        onRecordCreated={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;
