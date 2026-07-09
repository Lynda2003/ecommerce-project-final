import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/authSlice';
import { toast } from 'react-toastify';
import './AuthPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) navigate('/');
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [user, error, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Remplis tous les champs');
    dispatch(login({ email, password }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🛍️ ShopMERN</h1>
          <h2>Connexion</h2>
          <p>Bienvenue ! Connectez-vous à votre compte.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
        </div>
        <div className="admin-hint">
          <p>🔑 Admin test : admin@ecommerce.com / admin123456</p>
        </div>
      </div>
    </div>
  );
}