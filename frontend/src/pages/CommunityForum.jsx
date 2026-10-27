import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, ThumbsUp, MessageSquare, Plus, CheckCircle, Tag, Send } from 'lucide-react';

const CommunityForum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Organic Methods',
    tags: 'organic, yield, bio-fertilizer',
  });

  const categories = [
    'All',
    'Organic Methods',
    'Pest & Disease',
    'Soil & Fertilizers',
    'Irrigation & Tech',
    'Market & Schemes',
    'General',
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (search) params.append('search', search);

      const res = await api.get(`/forum?${params.toString()}`);
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const handleUpvote = async (postId) => {
    try {
      await api.post(`/forum/${postId}/upvote`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/forum', formData);
      if (res.data.success) {
        setShowNewModal(false);
        setFormData({ title: '', content: '', category: 'Organic Methods', tags: '' });
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      await api.post(`/forum/${postId}/comment`, { content: text });
      setCommentInputs({ ...commentInputs, [postId]: '' });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="community-forum-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-0">Kisan Knowledge Exchange & Forum</h2>
          <small className="text-muted">Peer-to-peer farmer discussions, organic practices, and expert validations</small>
        </div>

        <button onClick={() => setShowNewModal(true)} className="btn btn-agri">
          <Plus size={16} /> Start New Discussion
        </button>
      </div>

      {/* Category Pills */}
      <div className="agri-card p-3 mb-4">
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm rounded-pill px-3 ${selectedCategory === cat ? 'btn-success' : 'btn-light border text-secondary'}`}
              style={{ fontSize: '0.82rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {posts.map((post) => (
            <div key={post._id} className="agri-card p-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-success-subtle text-success p-2 rounded-circle">
                    <Users size={18} />
                  </div>
                  <div>
                    <strong className="text-dark small">{post.authorName || 'Farmer'}</strong>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {new Date(post.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </div>
                  </div>
                </div>
                <span className="badge bg-light text-dark border small">{post.category}</span>
              </div>

              <h5 className="fw-bold text-dark mb-2">{post.title}</h5>
              <p className="text-secondary small mb-3 lh-base">{post.content}</p>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {post.tags.map((tg, idx) => (
                    <span key={idx} className="badge bg-light text-muted border" style={{ fontSize: '0.72rem' }}>
                      #{tg}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Bar */}
              <div className="d-flex align-items-center gap-3 pt-3 border-top mb-3">
                <button
                  onClick={() => handleUpvote(post._id)}
                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                >
                  <ThumbsUp size={14} />
                  <span>{post.upvotes?.length || 0} Upvotes</span>
                </button>
                <div className="small text-muted d-flex align-items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{post.comments?.length || 0} Comments</span>
                </div>
              </div>

              {/* Comments Section */}
              {post.comments?.length > 0 && (
                <div className="p-3 rounded bg-light border mb-3">
                  <div className="small fw-semibold text-dark mb-2">Responses:</div>
                  <div className="d-flex flex-column gap-2">
                    {post.comments.map((comm, cIdx) => (
                      <div key={comm._id || cIdx} className="p-2 rounded bg-white border small">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex align-items-center gap-1">
                            <strong className="text-dark">{comm.authorName}</strong>
                            {comm.isVerifiedSolution && (
                              <span className="badge bg-success-subtle text-success d-flex align-items-center gap-1">
                                <CheckCircle size={10} /> Verified Solution
                              </span>
                            )}
                          </div>
                          <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {new Date(comm.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <p className="mb-0 text-secondary">{comm.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Comment Input */}
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Write a constructive response or farmer tip..."
                  value={commentInputs[post._id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                />
                <button
                  className="btn btn-agri"
                  type="button"
                  onClick={() => handleAddComment(post._id)}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="agri-card p-5 text-center text-muted">
          <Users size={48} className="text-muted mb-3 opacity-50" />
          <h5>No forum threads in this category yet.</h5>
          <p className="small mb-3">Be the first to share an agronomy tip or ask a question to fellow farmers.</p>
          <button onClick={() => setShowNewModal(true)} className="btn btn-agri">
            Post First Discussion
          </button>
        </div>
      )}

      {/* New Post Modal */}
      {showNewModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">Start Discussion Thread</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowNewModal(false)}></button>
              </div>
              <form onSubmit={handleCreatePost}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Discussion Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Tips on managing wheat crown rot with Trichoderma"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Discussion Content</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Share your practical field experience, recipe, or question..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Keywords / Tags (Comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="wheat, organic, bio-agent"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowNewModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri">
                    Publish Discussion
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

export default CommunityForum;
