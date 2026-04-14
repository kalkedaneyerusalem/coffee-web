import { Link } from 'react-router-dom';
import { useCart } from '../context/cartContext';

export default function Navbar() {
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          Betsy Coffee
        </Link>

        <nav className="navbar-links">
          <Link to="/">Products</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/track-order">Track Order</Link>
          <Link to="/admin/orders">Admin</Link>
          <Link to="/cart" className="navbar-cart">
            Cart ({cartCount})
          </Link>
        </nav>
      </div>
    </header>
  );
}