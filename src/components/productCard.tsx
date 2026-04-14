import type { Product } from '../context/cartContext';
import { useCart } from '../context/cartContext';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="product-image-fallback">Coffee</div>
        )}
      </div>

      <div className="product-content">
        <div className="product-top">
          <div className="category-badge">{product.category ?? 'Coffee'}</div>
          <h3 className="product-title">{product.name}</h3>
          <p className="product-description">{product.description}</p>
        </div>

        <div className="product-bottom">
          <div className="product-price">${(product.price / 100).toFixed(2)}</div>

          <button
            className="primary-btn"
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </article>
  );
}