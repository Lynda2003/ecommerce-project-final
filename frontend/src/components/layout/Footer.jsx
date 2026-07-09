import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>🛍️ ShopMERN</h3>
          <p>Votre boutique en ligne moderne, rapide et sécurisée.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <Link to="/">Accueil</Link>
          <Link to="/products">Produits</Link>
          <Link to="/cart">Panier</Link>
        </div>
        <div>
          <h4>Compte</h4>
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
          <Link to="/profile">Mon Profil</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p>📧 support@shopmern.com</p>
          <p>📞 +216 XX XXX XXX</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 ShopMERN — Projet GoMyCode Full Stack MERN</p>
      </div>
    </footer>
  );
}