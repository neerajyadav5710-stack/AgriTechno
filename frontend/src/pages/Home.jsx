import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Activity,
  CloudSun,
  ShieldCheck,
  ShoppingBag,
  Users,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Award,
} from 'lucide-react';

const Home = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-gradient py-5 py-lg-6">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-light border border-success-subtle mb-3">
                <span className="badge bg-success rounded-pill">New 2.0</span>
                <span className="small text-success fw-semibold">Next-Gen Agricultural Precision OS</span>
              </div>
              <h1 className="display-4 fw-extrabold lh-tight mb-3 text-dark" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Empowering Farmers with <span style={{ color: '#059669' }}>Precision Digital Intelligence</span>
              </h1>
              <p className="lead text-secondary mb-4 fs-6 lh-base">
                Bridging traditional farming with automated soil NPK diagnostics, hyperlocal weather spray windows, IoT soil moisture telemetry, and certified farm subsidies.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to={user ? "/dashboard" : "/login"} className="btn btn-agri px-4 py-2 fs-6">
                  {user ? "Open Command Center" : "Launch Interactive Demo"} <ArrowRight size={18} />
                </Link>
                <Link to="/marketplace" className="btn btn-agri-outline px-4 py-2 fs-6">
                  Browse Agri Store
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="row g-3 pt-3 border-top">
                <div className="col-4">
                  <div className="fs-4 fw-bold text-dark font-monospace">18,500+</div>
                  <div className="small text-muted">Acres Managed</div>
                </div>
                <div className="col-4">
                  <div className="fs-4 fw-bold text-dark font-monospace">94.8%</div>
                  <div className="small text-muted">NPK Accuracy</div>
                </div>
                <div className="col-4">
                  <div className="fs-4 fw-bold text-dark font-monospace">₹1.4 Cr</div>
                  <div className="small text-muted">Subsidies Claimed</div>
                </div>
              </div>
            </div>

            {/* Hero Right: Live Interactive Card Preview */}
            <div className="col-lg-5">
              <div className="agri-card p-4 shadow-lg border-2" style={{ borderColor: '#10b98130' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-success-subtle p-2 rounded-circle text-success">
                      <Activity size={20} />
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Live Field Diagnostics</h6>
                      <small className="text-muted">Plot Alpha &bull; Karnal, Haryana</small>
                    </div>
                  </div>
                  <span className="badge bg-success">Optimal</span>
                </div>

                {/* Progress Meters */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-secondary">Soil Moisture Index</span>
                    <strong className="text-primary">48% (Target 45-55%)</strong>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div className="progress-bar bg-primary" style={{ width: '48%' }}></div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-secondary">Nitrogen Availability</span>
                    <strong className="text-success">245 kg/ha</strong>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div className="p-3 rounded bg-light border mb-3">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <CheckCircle size={16} className="text-success" />
                    <span className="fw-semibold small">Immediate Agronomic Action:</span>
                  </div>
                  <p className="mb-0 small text-secondary" style={{ fontSize: '0.8rem' }}>
                    Foliar spray window is clear tomorrow 7 AM - 11 AM. Apply 28 kg/acre Urea top-dressing at tillering stage.
                  </p>
                </div>

                <Link to="/soil-analytics" className="btn btn-sm btn-outline-success w-100 fw-semibold">
                  Test Your Soil Sample Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="badge bg-success-subtle text-success px-3 py-1 mb-2 fw-semibold">Modular Agriculture Suite</span>
            <h2 className="fw-bold mb-2">Designed for Every Stage of the Farm Cycle</h2>
            <p className="text-muted">From pre-sowing soil diagnostics to post-harvest market dispatch.</p>
          </div>

          <div className="row g-4">
            {/* Card 1 */}
            <div className="col-md-4">
              <div className="agri-card p-4 h-100">
                <div className="bg-success-subtle text-success p-3 rounded-3 d-inline-block mb-3">
                  <Sprout size={28} />
                </div>
                <h5 className="fw-bold mb-2">Soil Health Card & NPK Engine</h5>
                <p className="small text-muted mb-3">
                  Input your lab or kit soil metrics. Our rule engine calculates exact kg/acre of Urea, DAP, and MOP deficits, plus crop suitability matches.
                </p>
                <Link to="/soil-analytics" className="small text-success fw-bold d-inline-flex align-items-center gap-1">
                  Try Soil Diagnostic Engine <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-4">
              <div className="agri-card p-4 h-100">
                <div className="bg-warning-subtle text-warning p-3 rounded-3 d-inline-block mb-3">
                  <CloudSun size={28} />
                </div>
                <h5 className="fw-bold mb-2">Hyperlocal Weather & Pest Radar</h5>
                <p className="small text-muted mb-3">
                  Micro-climate forecasts with agricultural spray window scores, wind velocity advisories, and early warning pest alerts for Yellow Rust & Aphids.
                </p>
                <Link to="/weather" className="small text-warning fw-bold d-inline-flex align-items-center gap-1">
                  View Weather Advisory <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-4">
              <div className="agri-card p-4 h-100">
                <div className="bg-info-subtle text-info p-3 rounded-3 d-inline-block mb-3">
                  <Cpu size={28} />
                </div>
                <h5 className="fw-bold mb-2">IoT Farm & Plot Telemetry</h5>
                <p className="small text-muted mb-3">
                  Simulate or stream real-time data from wireless soil sensors. Automate drip irrigation cycles based on root-zone moisture depletion.
                </p>
                <Link to="/farms" className="small text-info fw-bold d-inline-flex align-items-center gap-1">
                  Explore Plot Manager <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-md-4">
              <div className="agri-card p-4 h-100">
                <div className="bg-primary-subtle text-primary p-3 rounded-3 d-inline-block mb-3">
                  <ShoppingBag size={28} />
                </div>
                <h5 className="fw-bold mb-2">Direct Agri Store with Subsidies</h5>
                <p className="small text-muted mb-3">
                  Purchase certified organic seeds, bio-fertilizers, and smart irrigation sets with automatic government subsidy discount calculations.
                </p>
                <Link to="/marketplace" className="small text-primary fw-bold d-inline-flex align-items-center gap-1">
                  Shop Verified Inputs <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 5 */}
            <div className="col-md-4">
              <div className="agri-card p-4 h-100">
                <div className="bg-danger-subtle text-danger p-3 rounded-3 d-inline-block mb-3">
                  <ShieldCheck size={28} />
                </div>
                <h5 className="fw-bold mb-2">Agri-Doctor Consultation</h5>
                <p className="small text-muted mb-3">
                  Submit crop disease tickets with photos. Certified agronomists diagnose leaf symptoms and issue step-by-step verified remedies.
                </p>
                <Link to="/ask-doctor" className="small text-danger fw-bold d-inline-flex align-items-center gap-1">
                  Consult an Expert <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 6 */}
            <div className="col-md-4">
              <div className="agri-card p-4 h-100">
                <div className="bg-secondary-subtle text-secondary p-3 rounded-3 d-inline-block mb-3">
                  <Users size={28} />
                </div>
                <h5 className="fw-bold mb-2">Kisan Community Forum</h5>
                <p className="small text-muted mb-3">
                  Connect with progressive farmers, share organic formulations like Jeevamrutha, discuss prevailing mandi rates, and learn together.
                </p>
                <Link to="/community" className="small text-secondary fw-bold d-inline-flex align-items-center gap-1">
                  Join Community Forum <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-5" style={{ backgroundColor: '#064e3b', color: 'white' }}>
        <div className="container text-center py-3">
          <h2 className="fw-bold mb-3">Ready to modernize your agricultural workflow?</h2>
          <p className="lead text-white-50 max-w-xl mx-auto mb-4 fs-6">
            Log in with 1-click demo credentials as a Farmer, Expert Agronomist, or System Administrator.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-warning px-4 py-2 fw-semibold">
              Explore Demo System
            </Link>
            <Link to="/register" className="btn btn-outline-light px-4 py-2">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
