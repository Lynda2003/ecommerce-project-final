import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cartSlice';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success('Produit ajouté au panier ! 🛒');
    navigate('/cart');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Avis ajouté !');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: 100 }} />;
  if (!product) return <div className="container"><p>Produit non trouvé</p></div>;

  return (
    <div className="container product-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>← Retour</button>

      <div className="detail-grid">
        <div className="detail-img">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="detail-brand">par <strong>{product.brand}</strong></p>

          <div className="detail-rating">
            {[1,2,3,4,5].map(s => (
              <span key={s} className={s <= Math.round(product.rating) ? 'star filled' : 'star'}>★</span>
            ))}
            <span>({product.numReviews} avis)</span>
          </div>

          <div className="detail-price">{product.price.toFixed(2)} €</div>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-stock">
            {product.countInStock > 0 ? (
              <span className="in-stock">✅ En stock ({product.countInStock} disponibles)</span>
            ) : (
              <span className="out-stock">❌ Rupture de stock</span>
            )}
          </div>

          {product.countInStock > 0 && (
            <div className="detail-qty">
              <label>Quantité :</label>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {Array.from({ length: Math.min(product.countInStock, 10) }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          <button
            className="btn btn-primary detail-cart-btn"
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
          >
            🛒 Ajouter au panier
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Avis clients ({product.numReviews})</h2>

        {product.reviews.length === 0 && (
          <p className="no-reviews">Aucun avis pour ce produit. Soyez le premier !</p>
        )}

        <div className="reviews-list">
          {product.reviews.map((r) => (
            <div key={r._id} className="review-card">
              <div className="review-header">
                <strong>{r.name}</strong>
                <div className="stars">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={s <= r.rating ? 'star filled' : 'star'}>★</span>
                  ))}
                </div>
                <span className="review-date">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>

        {user ? (
          <div className="review-form">
            <h3>Laisser un avis</h3>
            <form onSubmit={handleReview}>
              <div className="form-group">
                <label>Note</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  {[5,4,3,2,1].map(n => (
                    <option key={n} value={n}>{n} ★ — {['Excellent','Très bien','Bien','Moyen','Mauvais'][5-n]}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Commentaire</label>
                <textarea
                  rows="4"
                  placeholder="Votre avis..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Publier l'avis</button>
            </form>
          </div>
        ) : (
          <p className="login-review">
            <a href="/login">Connectez-vous</a> pour laisser un avis.
          </p>
        )}
      </div>
    </div>
  );
}