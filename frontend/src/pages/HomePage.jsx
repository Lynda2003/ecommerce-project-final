import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import './HomePage.css';

const CATEGORIES = ['Tous', 'Chaussures', 'Vetements', 'Accessoires', 'Electronique', 'Beaute'];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Tous');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = category !== 'Tous' ? `?category=${category}` : '';
      const { data } = await api.get(`/products${params}`);
      setProducts(data.products);
      setLoading(false);
    };
    fetchProducts();
  }, [category]);

  return (
    <div>
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">🚀 Nouveau · Collection 2026</span>
            <h1>Découvrez la mode <span className="gradient-text">tendance</span></h1>
            <p>Des produits premium livrés rapidement, à des prix imbattables.</p>
            <div className="hero-btns">
              <Link to="/products" className="btn btn-primary">Explorer la boutique</Link>
              <Link to="/register" className="btn btn-outline">Créer un compte</Link>
            </div>
            <div className="hero-stats">
              <div><strong>500+</strong><span>Produits</span></div>
              <div><strong>10k+</strong><span>Clients</span></div>
              <div><strong>4.9★</strong><span>Note moyenne</span></div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-img-blob">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600" alt="Shopping" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Nos Produits</h2>
            <p>Découvrez notre sélection de produits premium</p>
          </div>
          <div className="categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          {loading ? <div className="spinner" /> : (
            <div className="grid-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div className="see-all">
            <Link to="/products" className="btn btn-outline">Voir tous les produits →</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container features-grid">
          {[
            { icon: '🚚', title: 'Livraison rapide', desc: 'Livraison en 24-48h partout' },
            { icon: '🔒', title: 'Paiement sécurisé', desc: 'Transactions 100% sécurisées' },
            { icon: '↩️', title: 'Retours gratuits', desc: '30 jours pour changer d\'avis' },
            { icon: '💬', title: 'Support 24/7', desc: 'Équipe disponible à tout moment' },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}