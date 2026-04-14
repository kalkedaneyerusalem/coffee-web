import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../context/cartContext';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const checkoutPayload = {
        customerName,
        customerEmail,
        customerPhone,
        street,
        city,
        state,
        zipCode,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const checkoutRes = await api.post('/checkout', checkoutPayload);

      const orderId = checkoutRes.data.orderId;

      const stripeRes = await api.post('/payments/create-checkout-session', {
        orderId,
      });

      const stripeUrl = stripeRes.data.url;

      if (!stripeUrl) {
        throw new Error('Stripe checkout URL was not returned');
      }

      clearCart();
      window.location.href = stripeUrl;
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="section-card">Your cart is empty.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <Link to="/cart" className="secondary-link">
          ← Back to cart
        </Link>

        <div className="checkout-layout">
          <div className="section-card">
            <h1 className="checkout-title">Checkout</h1>
            <p className="checkout-subtitle">
              Enter your details to place your order.
            </p>

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-section-title">Contact Information</div>

              <input
                placeholder="Full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />

              <input
                placeholder="Email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />

              <input
                placeholder="Phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />

              <div className="form-section-title">Shipping Address</div>

              <input
                placeholder="Street address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />

              <div className="checkout-row">
                <input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />

                <input
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>

              <input
                placeholder="ZIP code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />

              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? 'Redirecting to payment...' : 'Continue to Payment'}
              </button>
            </form>
          </div>

          <div className="section-card checkout-summary-card">
            <h2 className="summary-heading">Order Summary</h2>

            <div className="checkout-summary-list">
              {items.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <div>
                    <div className="checkout-item-name">{item.name}</div>
                    <div className="checkout-item-meta">
                      Qty {item.quantity}
                    </div>
                  </div>

                  <div className="checkout-item-price">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-total-row">
              <span>Subtotal</span>
              <strong>${(subtotal / 100).toFixed(2)}</strong>
            </div>

            <div className="checkout-total-row">
              <span>Shipping</span>
              <strong>Calculated at fulfillment</strong>
            </div>

            <div className="checkout-grand-total">
              <span>Total</span>
              <strong>${(subtotal / 100).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}