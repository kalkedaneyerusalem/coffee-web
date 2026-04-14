import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

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

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
  category?: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [shippingForm, setShippingForm] = useState<
    Record<string, { carrier: string; trackingNumber: string }>
  >({});

  const productMap = useMemo(() => {
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products'),
      ]);

      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to load admin data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (
    orderId: string,
    status: 'pending' | 'paid' | 'shipped' | 'delivered',
  ) => {
    try {
      await api.patch(`/orders/status/${orderId}`, { status });
      await loadData();
    } catch (error) {
      console.error('Failed to update order status', error);
      alert('Failed to update order status');
    }
  };

  const shipOrder = async (orderId: string) => {
    const form = shippingForm[orderId];

    if (!form?.carrier || !form?.trackingNumber) {
      alert('Please enter both carrier and tracking number.');
      return;
    }

    try {
      await api.patch(`/orders/ship/${orderId}`, {
        carrier: form.carrier,
        trackingNumber: form.trackingNumber,
      });

      await loadData();
    } catch (error) {
      console.error('Failed to ship order', error);
      alert('Failed to ship order');
    }
  };

  const getOrderTotal = (order: Order) => {
    return order.items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);
  };

  const updateShippingField = (
    orderId: string,
    field: 'carrier' | 'trackingNumber',
    value: string,
  ) => {
    setShippingForm((prev) => ({
      ...prev,
      [orderId]: {
        carrier: prev[orderId]?.carrier ?? '',
        trackingNumber: prev[orderId]?.trackingNumber ?? '',
        [field]: value,
      },
    }));
  };

  return (
    <div className="page">
      <div className="container">
        <div className="section-card">
          <h1 className="checkout-title">Admin Orders</h1>
          <p className="checkout-subtitle">
            View customer orders and update fulfillment status.
          </p>

          {loading ? (
            <div className="empty-state">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="empty-state">No orders found.</div>
          ) : (
            <div className="admin-orders-list">
              {orders.map((order) => {
                const orderTotal = getOrderTotal(order);

                return (
                  <div key={order.id} className="admin-order-card">
                    <div className="admin-order-top">
                      <div>
                        <div className="admin-order-id">Order #{order.id}</div>
                        <div className="admin-order-meta">
                          {order.customerName} • {order.customerEmail}
                        </div>
                        <div className="admin-order-meta">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className={`status-badge status-${order.status}`}>
                        {order.status}
                      </div>
                    </div>

                    <div className="admin-order-section">
                      <strong>Shipping Address</strong>
                      <div className="admin-order-meta">
                        {order.street || '—'}
                        {order.city ? `, ${order.city}` : ''}
                        {order.state ? `, ${order.state}` : ''}
                        {order.zipCode ? ` ${order.zipCode}` : ''}
                      </div>
                    </div>

                    <div className="admin-order-section">
                      <strong>Items</strong>
                      <div className="admin-order-items">
                        {order.items.map((item, index) => {
                          const product = productMap.get(item.productId);
                          const lineTotal = product
                            ? product.price * item.quantity
                            : 0;

                          return (
                            <div key={index} className="admin-order-item">
                              <div className="admin-order-item-name">
                                {product?.name ?? 'Unknown product'}
                              </div>
                              <div className="admin-order-item-meta">
                                Qty: {item.quantity}
                                {product ? (
                                  <>
                                    {' '}
                                    • ${(product.price / 100).toFixed(2)} each
                                    {' '}
                                    • Line total: ${(lineTotal / 100).toFixed(2)}
                                  </>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="admin-order-total">
                      Order Total: ${(orderTotal / 100).toFixed(2)}
                    </div>

                    {order.carrier || order.trackingNumber ? (
                      <div className="admin-order-section">
                        <strong>Shipment Info</strong>
                        <div className="admin-order-meta">
                          {order.carrier ? `Carrier: ${order.carrier}` : ''}
                          {order.carrier && order.trackingNumber ? ' • ' : ''}
                          {order.trackingNumber
                            ? `Tracking: ${order.trackingNumber}`
                            : ''}
                        </div>
                      </div>
                    ) : null}

                    {order.status !== 'delivered' && (
                      <div className="admin-order-section">
                        <strong>Ship Order</strong>
                        <div className="shipping-form">
                          <input
                            className="shipping-input"
                            placeholder="Carrier (e.g. USPS)"
                            value={shippingForm[order.id]?.carrier ?? ''}
                            onChange={(e) =>
                              updateShippingField(
                                order.id,
                                'carrier',
                                e.target.value,
                              )
                            }
                          />
                          <input
                            className="shipping-input"
                            placeholder="Tracking number"
                            value={shippingForm[order.id]?.trackingNumber ?? ''}
                            onChange={(e) =>
                              updateShippingField(
                                order.id,
                                'trackingNumber',
                                e.target.value,
                              )
                            }
                          />
                          <button
                            className="primary-btn"
                            style={{ maxWidth: 180 }}
                            onClick={() => shipOrder(order.id)}
                          >
                            Save Shipment
                          </button>
                        </div>
                      </div>
                    )}

                    {order.status !== 'delivered' && (
                      <div className="admin-order-actions">
                        <button
                          className="primary-btn"
                          style={{ maxWidth: 180 }}
                          onClick={() => updateStatus(order.id, 'delivered')}
                        >
                          Mark Delivered
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}