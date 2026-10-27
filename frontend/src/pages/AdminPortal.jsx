import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  ShieldAlert,
  Users,
  ShoppingBag,
  TrendingUp,
  Activity,
  Layers,
  CheckCircle,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

const AdminPortal = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleMessage, setRoleMessage] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [sRes, uRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);

      if (sRes.data.success) setStats(sRes.data.stats);
      if (uRes.data.success) setUsers(uRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setRoleMessage(`User role updated to ${newRole}`);
        setTimeout(() => setRoleMessage(''), 2500);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-portal-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-danger mb-1">Administrative Privileges Active</span>
          <h2 className="fw-bold mb-0">System Control & Telemetry Command Center</h2>
          <small className="text-muted">High-level ecosystem metrics, user role governance, and marketplace subsidy monitoring</small>
        </div>
      </div>

      {roleMessage && <div className="alert alert-success py-2 small">{roleMessage}</div>}

      {loading || !stats ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
        </div>
      ) : (
        <>
          {/* Top Analytics Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="agri-card p-3 h-100">
                <div className="d-flex justify-content-between align-items-center text-muted small mb-2">
                  <span>Registered Farmers & Experts</span>
                  <Users size={18} className="text-primary" />
                </div>
                <div className="fs-3 fw-bold text-dark font-monospace">{stats.totalUsers}</div>
                <small className="text-success" style={{ fontSize: '0.75rem' }}>Ecosystem Base</small>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="agri-card p-3 h-100">
                <div className="d-flex justify-content-between align-items-center text-muted small mb-2">
                  <span>Total Farms Monitored</span>
                  <Layers size={18} className="text-success" />
                </div>
                <div className="fs-3 fw-bold text-dark font-monospace">{stats.totalFarms}</div>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>{stats.totalCrops} Crop Plots Active</small>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="agri-card p-3 h-100">
                <div className="d-flex justify-content-between align-items-center text-muted small mb-2">
                  <span>Gross Market Volume</span>
                  <ShoppingBag size={18} className="text-warning" />
                </div>
                <div className="fs-3 fw-bold text-dark font-monospace">₹{stats.totalRevenue}</div>
                <small className="text-success fw-semibold" style={{ fontSize: '0.75rem' }}>
                  {stats.totalOrders} Dispatched Orders
                </small>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="agri-card p-3 h-100">
                <div className="d-flex justify-content-between align-items-center text-muted small mb-2">
                  <span>Government Subsidy Total</span>
                  <TrendingUp size={18} className="text-danger" />
                </div>
                <div className="fs-3 fw-bold text-success font-monospace">₹{stats.totalSubsidyDisbursed}</div>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>DBT Claimed</small>
              </div>
            </div>
          </div>

          {/* User Management Table */}
          <div className="agri-card p-4 mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <UserCheck size={20} className="text-primary" /> User Governance & Access Roles ({users.length})
            </h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Current Role</th>
                    <th>Change Role</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="fw-bold text-dark">{u.name}</div>
                        {u.specialization && <small className="text-muted">{u.specialization}</small>}
                      </td>
                      <td className="text-muted">{u.email}</td>
                      <td>{u.location?.district ? `${u.location.district}, ${u.location.state}` : 'N/A'}</td>
                      <td>
                        <span
                          className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'expert' ? 'bg-info text-dark' : 'bg-success'}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          style={{ maxWidth: 140 }}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        >
                          <option value="farmer">Farmer</option>
                          <option value="expert">Expert</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Health Status */}
          <div className="row g-4">
            <div className="col-md-6">
              <div className="agri-card p-4">
                <h6 className="fw-bold mb-3">Active Alerts & Ticketing Queue</h6>
                <div className="d-flex justify-content-between p-3 rounded bg-light border mb-2">
                  <span className="small text-secondary">Active Emergency Pest Advisories</span>
                  <strong className="badge bg-warning text-dark font-monospace fs-6">{stats.activeAlerts}</strong>
                </div>
                <div className="d-flex justify-content-between p-3 rounded bg-light border">
                  <span className="small text-secondary">Pending Doctor Consultations</span>
                  <strong className="badge bg-danger font-monospace fs-6">{stats.openTickets}</strong>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="agri-card p-4">
                <h6 className="fw-bold mb-3">API & Database Infrastructure</h6>
                <ul className="list-unstyled small text-secondary mb-0 d-flex flex-column gap-2">
                  <li className="d-flex justify-content-between">
                    <span>Database Engine:</span>
                    <strong className="text-success">MongoDB Atlas / Mongoose Dual Store</strong>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Authentication Method:</span>
                    <strong className="text-dark">JWT Bearer (HMAC SHA-256)</strong>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Telemetry Stream:</span>
                    <strong className="text-primary">Simulated IoT LoRaWAN Hub</strong>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>GitHub Repository:</span>
                    <strong className="text-dark font-monospace">neerajyadav5710-stack/AgriTechno</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPortal;
