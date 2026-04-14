import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Product } from '../context/cartContext';
import ProductCard from '../components/productCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="page">
      <div className="container">
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-kicker">Single Origin • Ethiopian Coffee</div>
            <h1 className="hero-title">
              Rich Ethiopian coffee, crafted for everyday ritual.
            </h1>
            <p className="hero-text">
              Discover bold aroma, smooth body, and authentic character in every
              bag. Freshly roasted coffee inspired by Ethiopia’s coffee heritage.
            </p>

            <div className="hero-actions">
              <a href="#shop" className="hero-primary">
                Shop Collection
              </a>
              <a href="/about" className="hero-secondary">
                Our Story
              </a>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-badge">Fresh Roast</div>
            <div className="hero-panel-title">Betsy Ethiopian Coffee</div>
            <div className="hero-panel-text">
              Curated blends and single-origin selections for coffee lovers who
              want something warm, rich, and memorable.
            </div>
          </div>
        </section>

        <section id="shop" className="shop-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Shop</div>
              <h2 className="section-title">Featured Coffee</h2>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">No products found.</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}