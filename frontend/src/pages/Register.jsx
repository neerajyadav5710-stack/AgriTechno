import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'farmer',
    state: 'Haryana',
    district: 'Karnal',
    village: '',
    specialization: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 650 }}>
      <div className="agri-card p-4 p-lg-5 shadow-sm">
        <div className="text-center mb-4">
          <div className="bg-success-subtle p-3 rounded-circle d-inline-block text-success mb-2">
            <Sprout size={32} />
          </div>
          <h3 className="fw-bold">Create Your AgriTechno Account</h3>
          <p className="text-muted small">Join the digitally connected agricultural ecosystem</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <User size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Account Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="farmer">Farmer (Farm Owner/Operator)</option>
                <option value="expert">Agricultural Expert / Agronomist</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Mail size={16} className="text-muted" />
                </span>
                <input
                  type="email"
                  className="form-control border-start-0"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Mobile Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Phone size={16} className="text-muted" />
                </span>
                <input
                  type="tel"
                  className="form-control border-start-0"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold">Create Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Lock size={16} className="text-muted" />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">State</label>
              <input
                type="text"
                className="form-control"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">District</label>
              <input
                type="text"
                className="form-control"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">Village / Area</label>
              <input
                type="text"
                className="form-control"
                placeholder="Optional"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              />
            </div>

            {formData.role === 'expert' && (
              <div className="col-12">
                <label className="form-label small fw-semibold">Expertise / Specialization</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Soil Science, Plant Pathology, Entomology"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn btn-agri w-100 py-2 mt-4">
            {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top small text-muted">
          Already registered?{' '}
          <Link to="/login" className="text-success fw-bold">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
