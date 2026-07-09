import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, updateQty } from '../features/cartSlice';
import { toast } from 'react-toastify';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import './ShopPage.css';

const CATEGORIES = ['Tous', 'Chaussures', 'Vetements', 'Accessoires', 'Electronique', 'Beaute'];
const SORTS = [
  { value: 'default', label: 'Par défaut' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Tous');
  const [sort, setSort] = useState('default');
  const [priceMax, setPriceMax] = useState(1000);
  const [showCart, setShowCart] = useState(false);

  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = items.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const params = category !== 'Tous' ? `?category=${category}` : '';
      const { data } = await api.get(`/products${params}`);
      let prods = data.products;

      if (sort === 'price_asc') prods = [...prods].sort((a, b) => a.price - b.price);
      if (sort === 'price_desc') prods = [...prods].sort((a, b) => b.price - a.price);
      if (sort === 'rating') prods = [...prods].sort((a, b) => b.rating - a.rating);

      prods = prods.filter(p => p.price <= priceMax);
      setProducts(prods);
      setLoading(false);
    };
    fetch();
  }, [category, sort, priceMax]);

  const handleCheckout = () => {
    if (!user) { toast.info('Connectez-vous pour passer commande'); navigate('/login'); return; }
    navigate('/checkout');
  };

  return (
    <div className="shop-page">
      <div className="shop-hero">
        <div className="container">
          <div className="shop-hero-content">
            <div>
              <span className="shop-tag">🛍️ Boutique ShopTN</span>
              <h1>Faites vos achats</h1>
              <p>Livraison rapide partout en Tunisie · Paiement sécurisé</p>
            </div>
            <button className="cart-float-btn" onClick={() => setShowCart(true)}>
              🛒 Mon panier
              {cartCount > 0 && <span className="cfb-badge">{cartCount}</span>}
              {cartCount > 0 && <span className="cfb-total">{cartTotal.toFixed(3)} DT</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="container shop-body">
        <aside className="shop-sidebar">
          <div className="sidebar-section">
            <h3>Catégories</h3>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`sidebar-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <h3>Prix maximum</h3>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="price-range"
            />
            <div className="price-range-labels">
              <span>0 DT</span>
              <span className="price-range-val">{priceMax} DT</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Trier par</h3>
            {SORTS.map((s) => (
              <button
                key={s.value}
                className={`sidebar-btn ${sort === s.value ? 'active' : ''}`}
                onClick={() => setSort(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="sidebar-cart-mini">
            <div className="cart-mini-header">
              <h3>🛒 Panier</h3>
              <span className="cart-mini-count">{cartCount} article(s)</span>
            </div>
            {items.length === 0 ? (
              <p className="cart-mini-empty">Votre panier est vide</p>
            ) : (
              <>
                <div className="cart-mini-items">
                  {items.slice(0, 3).map((item) => (
                    <div key={item._id} className="cart-mini-item">
                      <img src={item.image} alt={item.name} />
                      <div className="cmi-info">
                        <p className="cmi-name">{item.name}</p>
                        <p className="cmi-price">{(item.price * item.qty).toFixed(3)} DT</p>
                      </div>
                      <button
                        className="cmi-remove"
                        onClick={() => dispatch(removeFromCart(item._id))}
                      >✕</button>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="cart-mini-more">+{items.length - 3} autre(s) article(s)</p>
                  )}
                </div>
                <div className="cart-mini-total">
                  <span>Total</span>
                  <strong>{cartTotal.toFixed(3)} DT</strong>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
                  Commander →
                </button>
                <Link to="/cart" className="cart-mini-link">Voir le panier complet</Link>
              </>
            )}
          </div>
        </aside>

        <main className="shop-main">
          <div className="shop-toolbar">
            <p className="shop-count"><strong>{products.length}</strong> produits trouvés</p>
            <div className="active-filters">
              {category !== 'Tous' && (
                <span className="filter-tag">
                  {category}
                  <button onClick={() => setCategory('Tous')}>✕</button>
                </span>
              )}
              {priceMax < 1000 && (
                <span className="filter-tag">
                  Max {priceMax} DT
                  <button onClick={() => setPriceMax(1000)}>✕</button>
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div className="shop-empty">
              <p style={{ fontSize: '3rem' }}>😕</p>
              <h3>Aucun produit trouvé</h3>
              <button className="btn btn-outline" onClick={() => { setCategory('Tous'); setPriceMax(1000); }}>
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </main>
      </div>

      {showCart && (
        <div className="cart-drawer-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>🛒 Mon Panier ({cartCount})</h2>
              <button className="drawer-close" onClick={() => setShowCart(false)}>✕</button>
            </div>

            {items.length === 0 ? (
              <div className="drawer-empty">
                <p style={{ fontSize: '3rem', textAlign: 'center', padding: '40px 0' }}>🛒</p>
                <p style={{ textAlign: 'center', color: 'var(--gray)' }}>Votre panier est vide</p>
              </div>
            ) : (
              <>
                <div className="drawer-items">
                  {items.map((item) => (
                    <div key={item._id} className="drawer-item">
                      <img src={item.image} alt={item.name} />
                      <div className="di-info">
                        <p className="di-name">{item.name}</p>
                        <p className="di-brand">{item.brand}</p>
                        <div className="di-controls">
                          <select
                            value={item.qty}
                            onChange={(e) => dispatch(updateQty({ id: item._id, qty: Number(e.target.value) }))}
                          >
                            {Array.from({ length: Math.min(item.countInStock, 10) }, (_, i) => i + 1).map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                          <span className="di-price">{(item.price * item.qty).toFixed(3)} DT</span>
                        </div>
                      </div>
                      <button className="di-remove" onClick={() => dispatch(removeFromCart(item._id))}>🗑️</button>
                    </div>
                  ))}
                </div>

                <div className="drawer-footer">
                  <div className="drawer-total">
                    <span>Sous-total</span>
                    <strong>{cartTotal.toFixed(3)} DT</strong>
                  </div>
                  <p className="drawer-shipping">
                    {cartTotal > 150 ? '✅ Livraison gratuite !' : `🚚 Livraison offerte dès 150 DT`}
                  </p>
                  <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleCheckout}>
                    Passer la commande →
                  </button>
                  <Link to="/cart" className="drawer-cart-link" onClick={() => setShowCart(false)}>
                    Voir le panier complet
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}