import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="secondary-link">
          ← Back to products
        </Link>

        <div className="section-card">
          <h1>Your Cart</h1>

          {items.length === 0 ? (
            <div className="empty-state">Your cart is empty.</div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="cart-row">
                  <div>
                    <h3 className="cart-title">{item.name}</h3>
                    <div className="cart-price">
                      ${(item.price / 100).toFixed(2)} each
                    </div>
                  </div>

                  <div>
                    <input
                      className="qty-input"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, Number(e.target.value))
                      }
                    />
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="summary">
                <div className="summary-total">
                  Total: ${(subtotal / 100).toFixed(2)}
                </div>

                <button
                  className="primary-btn"
                  style={{ maxWidth: 220 }}
                  onClick={() => navigate('/checkout')}
                >
                  Continue to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}