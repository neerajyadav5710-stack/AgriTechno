import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Plus, CheckCircle, MessageSquare, AlertCircle, Send, UserCheck } from 'lucide-react';

const AskDoctor = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [actionStepInput, setActionStepInput] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const [formData, setFormData] = useState({
    cropName: 'Wheat (HD-2967)',
    issueTitle: '',
    description: '',
    urgency: 'High',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
  });

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/consultations');
      if (res.data.success) {
        setConsultations(res.data.data);
        if (res.data.data.length > 0 && !selectedTicket) {
          setSelectedTicket(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/consultations', formData);
      if (res.data.success) {
        setShowNewModal(false);
        fetchConsultations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    setSubmittingReply(true);
    try {
      const steps = actionStepInput ? actionStepInput.split('\n').filter((s) => s.trim().length > 0) : [];
      const res = await api.post(`/consultations/${selectedTicket._id}/respond`, {
        message: replyMessage,
        actionSteps: steps,
      });

      if (res.data.success) {
        setReplyMessage('');
        setActionStepInput('');
        fetchConsultations();
        setSelectedTicket(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="ask-doctor-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-0">Agri-Doctor & Plant Pathologist Desk</h2>
          <small className="text-muted">Direct digital diagnosis of crop anomalies, deficiency symptoms, and bio-remedies</small>
        </div>

        <button onClick={() => setShowNewModal(true)} className="btn btn-agri">
          <Plus size={16} /> Open New Diagnosis Ticket
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : consultations.length > 0 ? (
        <div className="row g-4">
          {/* Tickets List Column */}
          <div className="col-lg-5">
            <h6 className="fw-bold mb-3">Consultation Cases ({consultations.length})</h6>
            <div className="d-flex flex-column gap-2">
              {consultations.map((ticket) => (
                <div
                  key={ticket._id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-3 rounded border agri-card-interactive ${selectedTicket?._id === ticket._id ? 'border-success bg-white shadow-sm' : 'bg-light'}`}
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="badge bg-secondary small">{ticket.cropName}</span>
                    <span className={`badge ${ticket.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <h6 className="fw-bold text-dark mb-1 fs-6">{ticket.issueTitle}</h6>
                  <p className="small text-muted mb-2 text-truncate" style={{ fontSize: '0.8rem' }}>
                    {ticket.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center small text-muted" style={{ fontSize: '0.72rem' }}>
                    <span>By: {ticket.farmerName || 'Farmer'}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Detail & Agronomist Response Column */}
          <div className="col-lg-7">
            {selectedTicket ? (
              <div className="agri-card p-4">
                <div className="d-flex justify-content-between align-items-start pb-3 border-bottom mb-3">
                  <div>
                    <span className={`badge ${selectedTicket.urgency === 'Critical' ? 'bg-danger' : selectedTicket.urgency === 'High' ? 'bg-warning text-dark' : 'bg-info text-dark'} mb-1`}>
                      Urgency: {selectedTicket.urgency}
                    </span>
                    <h4 className="fw-bold mb-1 text-dark">{selectedTicket.issueTitle}</h4>
                    <small className="text-muted">
                      Target Crop: <strong>{selectedTicket.cropName}</strong> &bull; Case ID: {selectedTicket._id?.substring(0, 10)}
                    </small>
                  </div>
                  <span className={`badge ${selectedTicket.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'} fs-6 px-3 py-1`}>
                    {selectedTicket.status}
                  </span>
                </div>

                {/* Problem Description */}
                <div className="p-3 rounded bg-light border mb-4">
                  <div className="fw-semibold small text-dark mb-1">Farmer Symptom Report:</div>
                  <p className="small text-secondary mb-2">{selectedTicket.description}</p>
                  {selectedTicket.imageUrl && (
                    <img
                      src={selectedTicket.imageUrl}
                      alt="Crop symptom"
                      className="rounded border"
                      style={{ maxHeight: 200, width: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>

                {/* Doctor's Verified Responses */}
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Stethoscope size={18} className="text-success" />
                  Agronomist Solutions & Action Steps ({selectedTicket.responses?.length || 0})
                </h6>

                <div className="d-flex flex-column gap-3 mb-4">
                  {selectedTicket.responses?.length > 0 ? (
                    selectedTicket.responses.map((resp, rIdx) => (
                      <div key={rIdx} className="p-3 rounded border" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-success">Verified Agri-Doctor</span>
                            <strong className="text-dark small">{resp.responderName}</strong>
                          </div>
                          <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                            {new Date(resp.createdAt).toLocaleDateString()}
                          </small>
                        </div>

                        <p className="small text-secondary mb-2">{resp.message}</p>

                        {resp.actionSteps?.length > 0 && (
                          <div className="p-2 rounded bg-white border small">
                            <strong className="text-success d-block mb-1">Step-by-Step Prescribed Actions:</strong>
                            <ul className="mb-0 ps-3">
                              {resp.actionSteps.map((step, sIdx) => (
                                <li key={sIdx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded bg-light text-center small text-muted">
                      No responses yet. An agronomist will review this case shortly.
                    </div>
                  )}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendResponse} className="pt-3 border-top">
                  <div className="mb-2">
                    <label className="form-label small fw-semibold">
                      {user?.role === 'expert' ? 'Submit Agronomic Solution / Advisory' : 'Reply / Provide Additional Symptoms'}
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="3"
                      placeholder={user?.role === 'expert' ? 'Explain cause (e.g. zinc chlorosis or fungus) and treatment...' : 'Add clarification or field update...'}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {user?.role === 'expert' && (
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Prescribed Steps (1 step per line)</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        placeholder="Spray 0.5% Zinc Sulphate + 1% Urea in 150L water&#10;Stop irrigation for 3 days"
                        value={actionStepInput}
                        onChange={(e) => setActionStepInput(e.target.value)}
                      ></textarea>
                    </div>
                  )}

                  <div className="text-end">
                    <button type="submit" disabled={submittingReply} className="btn btn-agri btn-sm">
                      <Send size={14} /> {submittingReply ? 'Sending...' : 'Post Solution'}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="agri-card p-5 text-center text-muted">
          <Stethoscope size={48} className="text-muted mb-3 opacity-50" />
          <h5>No active consultation cases.</h5>
          <p className="small mb-3">Notice yellow leaves, leaf curls, or pest holes? Create a diagnosis ticket for immediate expert guidance.</p>
          <button onClick={() => setShowNewModal(true)} className="btn btn-agri">
            Open First Ticket
          </button>
        </div>
      )}

      {/* New Consultation Modal */}
      {showNewModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">Submit Crop Problem Ticket</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowNewModal(false)}></button>
              </div>
              <form onSubmit={handleCreateTicket}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Affected Crop</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.cropName}
                      onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Problem Title / Summary</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Yellow leaf tips after flood irrigation"
                      value={formData.issueTitle}
                      onChange={(e) => setFormData({ ...formData, issueTitle: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Urgency Level</label>
                      <select
                        className="form-select"
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      >
                        <option value="Routine">Routine</option>
                        <option value="High">High (Spreading)</option>
                        <option value="Critical">Critical (Severe Damage)</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Photo Reference URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Detailed Description of Symptoms</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Mention days after sowing, color changes, presence of insects or spots..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowNewModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri">
                    Submit to Expert Desk
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

export default AskDoctor;
