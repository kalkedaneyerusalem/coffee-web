import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get('orderId');
 
  useEffect(() => {
    if (orderId) {
      api.post(`/payments/confirm/${orderId}`)
        .then(() => {
          console.log('Order marked as paid');
        })
        .catch((err) => {
          console.error('Failed to confirm payment', err);
        });
    }
  }, [orderId]);
  return (
    <div className="page">
      <div className="container">
        <div className="success-box">
          <h1>🎉 Payment successful</h1>

          <p>
            Thank you for your order! Your coffee is being prepared ☕
          </p>

          {orderId && (
            <p>
              <strong>Order ID:</strong> {orderId}
            </p>
          )}

          <div style={{ marginTop: 20 }}>
            <p>We’ll notify you when your order ships.</p>
          </div>
<div style={{display:'flex', flexDirection:'column'}}>
          <Link to="/" className="secondary-link">
            Continue shopping
          </Link>

          <Link to={`/track-order?orderId=${orderId}`} className="secondary-link">
  Track your order
</Link>
</div>
        </div>
      </div>
    </div>
  );
}