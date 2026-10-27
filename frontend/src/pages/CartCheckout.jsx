import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const CartCheckout = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalSubsidy, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || 'Ramesh Kumar Yadav',
    phone: user?.phone || '+91 98765 43210',
    addressLine: 'Farm House #4, Nilokheri Road',
    village: 'Nilokheri',
    district: user?.location?.district || 'Karnal',
    state: user?.location?.state || 'Haryana',
    pincode: '132117',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/orders', {
        items: cartItems.map((item) => ({
          id: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          subsidySaved: item.subsidySaved,
        })),
        shippingAddress: address,
        paymentMethod,
      });

      if (res.data.success) {
        clearCart();
        navigate('/orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: 600 }}>
        <div className="agri-card p-5">
          <ShoppingBag size={56} className="text-muted mb-3 opacity-50" />
          <h4 className="fw-bold mb-2">Your Shopping Cart is Empty</h4>
          <p className="text-muted small mb-4">
            Explore certified seeds, organic fertilizers, and subsidized irrigation kits in our Agri Store.
          </p>
          <Link to="/marketplace" className="btn btn-agri">
            Browse Agri Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-checkout-page">
      <h2 className="fw-bold mb-4">Review Order & Delivery Address</h2>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <div className="row g-4">
        {/* Left Column: Cart Items & Delivery Info */}
        <div className="col-lg-7">
          {/* Cart Items */}
          <div className="agri-card p-4 mb-4">
            <h5 className="fw-bold mb-3">Cart Items ({cartItems.length})</h5>
            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => (
                <div key={item._id} className="d-flex align-items-center gap-3 pb-3 border-bottom">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="rounded"
                    style={{ width: 64, height: 64, objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1 text-dark fs-6">{item.title}</h6>
                    <div className="small text-muted mb-1">
                      Rate: ₹{item.price} / {item.unit}
                      {item.subsidyPercent > 0 && (
                        <span className="badge bg-warning-subtle text-dark ms-2">
                          {item.subsidyPercent}% Subsidy
                        </span>
                      )}
                    </div>
                    {item.subsidySaved > 0 && (
                      <div className="small text-success fw-semibold">
                        Subsidy Savings: ₹{item.subsidySaved}
                      </div>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <button className="btn btn-light" disabled>
                        {item.quantity}
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-sm btn-link text-danger p-1"
                      onClick={() => removeFromCart(item._id)}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Form */}
          <div className="agri-card p-4">
            <h5 className="fw-bold mb-3">Delivery Address</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Recipient Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold">Farm / House Address Line</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.addressLine}
                  onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold">Village / Landmark</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.village}
                  onChange={(e) => setAddress({ ...address, village: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold">District</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.district}
                  onChange={(e) => setAddress({ ...address, district: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold">State</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Postal PIN Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Calculation & Payment Method */}
        <div className="col-lg-5">
          <div className="agri-card p-4 sticky-top" style={{ top: '80px' }}>
            <h5 className="fw-bold mb-3">Order Price Summary</h5>

            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Items Total (MRP)</span>
              <span>₹{subtotal}</span>
            </div>

            {totalSubsidy > 0 && (
              <div className="d-flex justify-content-between mb-2 small text-success fw-semibold">
                <span>Government DBT Subsidy</span>
                <span>- ₹{totalSubsidy}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-3 small text-muted">
              <span>Direct Doorstep Farm Delivery</span>
              <span className="text-success fw-bold">FREE</span>
            </div>

            <hr className="my-3" />

            <div className="d-flex justify-content-between align-items-baseline mb-4">
              <span className="fw-bold text-dark fs-5">Net Payable Amount</span>
              <span className="fs-3 fw-bold text-success font-monospace">₹{totalAmount}</span>
            </div>

            {/* Payment Method Selector */}
            <h6 className="fw-bold mb-2">Select Payment Method</h6>
            <div className="d-flex flex-column gap-2 mb-4">
              {['Cash on Delivery', 'UPI / NetBanking', 'Kisan Credit Card (KCC)'].map((method) => (
                <label
                  key={method}
                  className={`p-3 rounded border agri-card-interactive d-flex align-items-center gap-2 ${paymentMethod === method ? 'border-success bg-success-subtle' : 'bg-light'}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span className="small fw-semibold text-dark">{method}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn btn-agri w-100 py-3 fs-6"
            >
              {loading ? 'Submitting Order...' : 'Confirm & Place Order'} <ArrowRight size={18} />
            </button>

            <div className="mt-3 text-center small text-muted d-flex align-items-center justify-content-center gap-1">
              <ShieldCheck size={16} className="text-success" /> Certified Genuine Agricultural Supplies
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;
