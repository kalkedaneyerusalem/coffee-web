import { type FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useSearchParams } from 'react-router-dom';

type OrderItem = {
  productId: string;
  quantity: number;
};

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  carrier?: string;
  trackingNumber?: string;
  items: OrderItem[];
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: string;
};

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();

  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      setOrder(null);

      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error('Failed to load order', err);
      setError('Order not found. Please check your order ID.');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Auto-load if orderId exists in URL
  useEffect(() => {
    const idFromUrl = searchParams.get('orderId');

    if (idFromUrl) {
      setOrderId(idFromUrl);
      fetchOrder(idFromUrl);
    }
  }, [searchParams]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="section-card">
          <h1 className="checkout-title">Track Your Order</h1>
          <p className="checkout-subtitle">
            Enter your order ID to see your coffee delivery status.
          </p>

          <form className="track-form" onSubmit={handleSearch}>
            <input
              className="shipping-input"
              placeholder="Enter your order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
            <button className="primary-btn" disabled={loading}>
              {loading ? 'Checking...' : 'Track Order'}
            </button>
          </form>

          {error && <div className="track-error">{error}</div>}

          {order && (
            <div className="track-result">
              <div className="track-status-row">
                <div>
                  <div className="admin-order-id">Order #{order.id}</div>
                  <div className="admin-order-meta">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className={`status-badge status-${order.status}`}>
                  {order.status}
                </div>
              </div>

              {/* Progress */}
              <div className="track-progress">
                <div className={`track-step ${order.status !== 'pending' ? 'active' : ''}`}>
                  Pending
                </div>
                <div className={`track-step ${['paid','shipped','delivered'].includes(order.status) ? 'active' : ''}`}>
                  Paid
                </div>
                <div className={`track-step ${['shipped','delivered'].includes(order.status) ? 'active' : ''}`}>
                  Shipped
                </div>
                <div className={`track-step ${order.status === 'delivered' ? 'active' : ''}`}>
                  Delivered
                </div>
              </div>

              {/* Shipment */}
              {(order.carrier || order.trackingNumber) && (
                <div className="admin-order-section">
                  <strong>Shipment Info</strong>
                  <div className="admin-order-meta">
                    {order.carrier && `Carrier: ${order.carrier}`}
                    {order.carrier && order.trackingNumber && ' • '}
                    {order.trackingNumber && `Tracking: ${order.trackingNumber}`}
                  </div>
                </div>
              )}

              {/* Status message */}
              <div className="admin-order-section">
                <strong>Status</strong>
                <div className="admin-order-meta">
                  {order.status === 'pending' && 'Waiting for payment'}
                  {order.status === 'paid' && 'Preparing your coffee'}
                  {order.status === 'shipped' && 'Your order is on the way 🚚'}
                  {order.status === 'delivered' && 'Delivered ☕ Enjoy!'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}