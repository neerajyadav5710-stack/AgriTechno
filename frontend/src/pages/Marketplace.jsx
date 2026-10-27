import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Search, Filter, Check, Star, ShieldCheck, Tag } from 'lucide-react';

const Marketplace = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [subsidyOnly, setSubsidyOnly] = useState(false);
  const [addedItem, setAddedItem] = useState(null);

  const { addToCart } = useCart();

  const categories = [
    'All',
    'Seeds',
    'Bio-Fertilizers',
    'Pest Control',
    'Smart Sensors',
    'Irrigation',
  ];

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (search) params.append('search', search);
      if (subsidyOnly) params.append('subsidyOnly', 'true');

      const res = await api.get(`/resources?${params.toString()}`);
      if (res.data.success) {
        setResources(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, subsidyOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleAdd = (item) => {
    addToCart(item, 1);
    setAddedItem(item._id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  return (
    <div className="marketplace-page">
      {/* Banner */}
      <div className="p-4 p-lg-5 rounded-4 text-white mb-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)' }}>
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-warning text-dark px-3 py-1 mb-2 fw-bold">Verified Inputs Portal</span>
            <h2 className="display-6 fw-bold mb-2">Direct Agricultural Supplies & Subsidies</h2>
            <p className="text-white-50 mb-0">
              Procure certified seeds, biological pest controls, and precision IoT equipment with direct DBT / PM-KUSUM subsidy deductions.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <Link to="/cart" className="btn btn-warning px-4 py-2 fw-semibold">
              <ShoppingBag size={18} className="me-1" /> View Cart & Checkout
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="agri-card p-3 mb-4">
        <div className="row g-3 align-items-center justify-content-between">
          <div className="col-md-5">
            <form onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search seeds, fertilizers, sensors, drip kits..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-agri" type="submit">
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="col-md-7 d-flex justify-content-md-end align-items-center flex-wrap gap-2">
            {/* Subsidy Toggle */}
            <div className="form-check form-switch me-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="subsidyToggle"
                checked={subsidyOnly}
                onChange={(e) => setSubsidyOnly(e.target.checked)}
              />
              <label className="form-check-label small fw-semibold text-secondary" htmlFor="subsidyToggle">
                Government Subsidy Only
              </label>
            </div>

            {/* Category Pills */}
            <div className="d-flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm rounded-pill px-3 ${selectedCategory === cat ? 'btn-success' : 'btn-light border text-secondary'}`}
                  style={{ fontSize: '0.8rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : resources.length > 0 ? (
        <div className="row g-4">
          {resources.map((res) => {
            const effectivePrice = res.discountPrice > 0 ? res.discountPrice : res.price;
            const subsidyAmount = res.subsidyEligible ? Math.round((effectivePrice * (res.subsidyPercent || 0)) / 100) : 0;
            const finalPayable = effectivePrice - subsidyAmount;

            return (
              <div key={res._id} className="col-sm-6 col-lg-4">
                <div className="agri-card h-100 d-flex flex-column overflow-hidden">
                  <div className="position-relative" style={{ height: 180, overflow: 'hidden' }}>
                    <img
                      src={res.imageUrl}
                      alt={res.title}
                      className="w-100 h-100 object-fit-cover"
                      style={{ objectFit: 'cover' }}
                    />
                    {res.subsidyEligible && (
                      <span className="badge-subsidy position-absolute top-0 start-0 m-2 shadow-sm">
                        <Tag size={12} /> {res.subsidyPercent}% Govt Subsidy
                      </span>
                    )}
                    <span className="badge bg-dark bg-opacity-75 position-absolute bottom-0 end-0 m-2 text-white small">
                      {res.category}
                    </span>
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted fw-semibold">{res.brand}</small>
                      <div className="d-flex align-items-center gap-1 text-warning small">
                        <Star size={14} fill="#f59e0b" />
                        <span className="text-dark fw-bold">{res.rating || 4.8}</span>
                      </div>
                    </div>

                    <h5 className="fw-bold mb-2 text-dark fs-6" style={{ minHeight: 44 }}>
                      {res.title}
                    </h5>

                    <p className="small text-muted mb-3 flex-grow-1" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                      {res.description?.substring(0, 100)}...
                    </p>

                    {/* Price and Subsidy Computation */}
                    <div className="pt-2 border-top mb-3">
                      <div className="d-flex align-items-baseline gap-2">
                        <span className="fs-5 fw-bold text-dark font-monospace">₹{finalPayable}</span>
                        {res.subsidyEligible ? (
                          <>
                            <span className="text-decoration-line-through text-muted small">₹{effectivePrice}</span>
                            <span className="badge bg-success-subtle text-success small">Save ₹{subsidyAmount}</span>
                          </>
                        ) : res.discountPrice > 0 ? (
                          <span className="text-decoration-line-through text-muted small">₹{res.price}</span>
                        ) : null}
                      </div>
                      <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                        Per {res.unit || 'unit'} &bull; In stock: {res.stock}
                      </small>
                    </div>

                    <button
                      onClick={() => handleAdd(res)}
                      className={`btn w-100 ${addedItem === res._id ? 'btn-success' : 'btn-agri'}`}
                    >
                      {addedItem === res._id ? (
                        <>
                          <Check size={16} /> Added to Cart!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="agri-card p-5 text-center text-muted">
          <ShoppingBag size={48} className="text-muted mb-3 opacity-50" />
          <h5>No supplies matched your filters.</h5>
          <p className="small">Try resetting the category filter or searching with different terms.</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
