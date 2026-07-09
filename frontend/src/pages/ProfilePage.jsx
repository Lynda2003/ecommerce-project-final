import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirm) return toast.error('Les mots de passe ne correspondent pas');
    setLoading(true);
    try {
      await api.put('/users/profile', { name, email, password: password || undefined });
      toast.success('Profil mis à jour ! ✅');
      setPassword('');
      setConfirm('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
    setLoading(false);
  };

  return (
    <div className="container profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          {user?.isAdmin && <span className="badge badge-success">Admin</span>}
        </div>
      </div>

      <div className="profile-card">
        <h2>Modifier mon profil</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="profile-divider">
            <span>Changer le mot de passe (optionnel)</span>
          </div>
          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              placeholder="Laisser vide pour ne pas changer"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="Répéter le nouveau mot de passe"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Mise à jour...' : 'Sauvegarder les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}