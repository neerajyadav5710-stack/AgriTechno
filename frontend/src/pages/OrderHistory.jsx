import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ShoppingBag, Package, Truck, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Delivered':
        return 'bg-success';
      case 'Dispatched':
        return 'bg-primary';
      case 'Confirmed':
        return 'bg-info text-dark';
      case 'Placed':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="order-history-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">My Resource Orders</h2>
          <small className="text-muted">Track logistics dispatch, certified invoices, and subsidized shipments</small>
        </div>
        <Link to="/marketplace" className="btn btn-outline-success">
          Order Supplies
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {orders.map((ord) => (
            <div key={ord._id} className="agri-card p-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-3 border-bottom mb-3">
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-dark fs-6">Tracking: {ord.trackingId}</span>
                    <span className={`badge ${getStatusBadge(ord.orderStatus)}`}>
                      {ord.orderStatus}
                    </span>
                  </div>
                  <small className="text-muted">
                    Placed on: {new Date(ord.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </small>
                </div>

                <div className="text-end">
                  <div className="fs-5 fw-bold text-dark font-monospace">₹{ord.totalAmount}</div>
                  <small className="text-muted">{ord.paymentMethod} &bull; {ord.paymentStatus}</small>
                </div>
              </div>

              {/* Items List */}
              <div className="mb-3">
                {ord.items?.map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center small py-1">
                    <div>
                      <strong>{item.title}</strong> &times; {item.quantity} ({item.unit})
                    </div>
                    <span className="text-muted font-monospace">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Delivery and Subsidy Details */}
              <div className="p-3 rounded bg-light border small d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <span className="text-muted">Delivery Address: </span>
                  <strong>{ord.shippingAddress?.fullName}, {ord.shippingAddress?.addressLine}, {ord.shippingAddress?.district}, {ord.shippingAddress?.state} - {ord.shippingAddress?.pincode}</strong>
                </div>

                {ord.subsidyDiscount > 0 && (
                  <span className="badge bg-success-subtle text-success">
                    Subsidies Applied: ₹{ord.subsidyDiscount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="agri-card p-5 text-center text-muted">
          <ShoppingBag size={48} className="text-muted mb-3 opacity-50" />
          <h5>No orders placed yet.</h5>
          <p className="small mb-3">Browse our verified seed and fertilizer catalogue to place your first dispatch.</p>
          <Link to="/marketplace" className="btn btn-agri">
            Go to Agri Store
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
