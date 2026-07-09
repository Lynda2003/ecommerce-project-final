import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cartSlice';
import { toast } from 'react-toastify';
import './ProductCard.css';

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= Math.round(rating) ? 'star filled' : 'star'}>★</span>
      ))}
      <span className="rating-num">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [wished, setWished] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (product.countInStock === 0) return;
    setAdding(true);
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.name} ajouté au panier ! 🛒`);
    setTimeout(() => setAdding(false), 800);
  };

  const handleWish = (e) => {
    e.preventDefault();
    setWished(!wished);
    toast(wished ? '💔 Retiré des favoris' : '❤️ Ajouté aux favoris');
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card card">
      <div className="product-img-wrap">
        <img src={product.image} alt={product.name} className="product-img" loading="lazy" />

        <button className={`wish-btn ${wished ? 'wished' : ''}`} onClick={handleWish} title="Favoris">
          {wished ? '❤️' : '🤍'}
        </button>

        {product.countInStock === 0 && (
          <div className="sold-out-ribbon">Rupture</div>
        )}
        {product.countInStock > 0 && product.countInStock <= 5 && (
          <div className="low-stock-badge">Plus que {product.countInStock} !</div>
        )}
        <div className="category-pill">{product.category}</div>

        <div className="card-overlay">
          <button
            className={`btn btn-white quick-add ${adding ? 'adding' : ''}`}
            onClick={handleAddToCart}
            disabled={product.countInStock === 0 || adding}
          >
            {adding ? '✓ Ajouté !' : '+ Ajouter au panier'}
          </button>
        </div>
      </div>

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <StarRating rating={product.rating} />
        <div className="product-footer">
          <div className="price-dt">
            <span className="price-amount">{product.price.toFixed(3)}</span>
            <span className="currency"> DT</span>
          </div>
          {product.numReviews > 0 && (
            <span className="reviews-count">{product.numReviews} avis</span>
          )}
        </div>
      </div>
    </Link>
  );
}