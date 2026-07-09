import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../features/authSlice';
import { toast } from 'react-toastify';
import './AuthPage.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) navigate('/');
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [user, error, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error('Remplis tous les champs');
    if (password !== confirm) return toast.error('Les mots de passe ne correspondent pas');
    if (password.length < 6) return toast.error('Minimum 6 caractères');
    dispatch(register({ name, email, password }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🛍️ ShopMERN</h1>
          <h2>Inscription</h2>
          <p>Créez votre compte gratuitement.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              placeholder="Minimum 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="Répétez le mot de passe"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
        </div>
      </div>
    </div>
  );
}