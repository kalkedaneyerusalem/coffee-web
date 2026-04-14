import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/cartContext';
import Navbar from './components/Navbar';
import ProductsPage from './pages/productsPage';
import CartPage from './pages/cartPage';
import CheckoutPage from './pages/checkoutPage';
import AboutPage from './pages/aboutPage';
import ContactPage from './pages/contactPage';
import OrderSuccessPage from './pages/orderSuccessPage';
import AdminOrdersPage from './pages/adminOrderPage';
import TrackOrderPage from './pages/trackOrderPage';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
           <Route path="/track-order" element={<TrackOrderPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}