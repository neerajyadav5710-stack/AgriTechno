import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight, UserCheck, ShieldCheck, Stethoscope } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError('');
    try {
      await login(demoEmail, demoPass);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      <div className="row g-4 justify-content-center">
        {/* Main Login Form */}
        <div className="col-md-6">
          <div className="agri-card p-4 p-lg-5 shadow-sm">
            <div className="text-center mb-4">
              <div className="bg-success-subtle p-3 rounded-circle d-inline-block text-success mb-2">
                <Sprout size={32} />
              </div>
              <h3 className="fw-bold">Sign In to AgriTechno</h3>
              <p className="text-muted small">Access your precision farm management dashboard</p>
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Mail size={16} className="text-muted" />
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0"
                    placeholder="e.g. ramesh@agritechno.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label small fw-semibold">Password</label>
                  <small className="text-muted">Min 6 characters</small>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Lock size={16} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-agri w-100 py-2 mt-2">
                {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top small text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-success fw-bold">
                Register Here
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Fast-Login Selector for Mentor/Evaluator */}
        <div className="col-md-5">
          <div className="agri-card p-4 bg-light border">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge bg-warning text-dark fw-bold">Fast Review Access</span>
              <h6 className="fw-bold mb-0">1-Click Role Testing</h6>
            </div>
            <p className="small text-muted mb-3">
              Click any demo account below to instantly test the platform with pre-populated agricultural data:
            </p>

            {/* Farmer Demo */}
            <div
              className="p-3 mb-2 rounded bg-white border agri-card-interactive"
              onClick={() => handleQuickDemo('ramesh@agritechno.com', 'farmer123')}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="bg-success text-white p-2 rounded-circle">
                  <UserCheck size={20} />
                </div>
                <div>
                  <div className="fw-bold small text-dark">Ramesh Kumar (Farmer)</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Plot Alpha (3.5 ac Wheat), Soil NPK records, Orders
                  </div>
                </div>
              </div>
            </div>

            {/* Expert Demo */}
            <div
              className="p-3 mb-2 rounded bg-white border agri-card-interactive"
              onClick={() => handleQuickDemo('anita@agritechno.com', 'expert123')}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="bg-info text-white p-2 rounded-circle">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <div className="fw-bold small text-dark">Dr. Anita Sharma (Agri-Doctor)</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Resolve farmer crop diagnosis tickets & advisories
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Demo */}
            <div
              className="p-3 rounded bg-white border agri-card-interactive"
              onClick={() => handleQuickDemo('admin@agritechno.com', 'admin123')}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="bg-danger text-white p-2 rounded-circle">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="fw-bold small text-dark">Neeraj Yadav (Administrator)</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    System analytics, user roles, pest warnings
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                GitHub Project: <strong>neerajyadav5710-stack/AgriTechno</strong>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
