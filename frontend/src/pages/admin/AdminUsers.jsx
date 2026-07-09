import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './Admin.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get('/users');
      setUsers(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    await api.delete(`/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
    toast.success('Utilisateur supprimé');
  };

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <h1>👥 Gestion des Clients</h1>
        <p>{users.length} utilisateurs</p>
      </div>
      {loading ? <div className="spinner" /> : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Inscrit le</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.isAdmin ? 'badge-success' : 'badge-warning'}`}>
                      {u.isAdmin ? 'Admin' : 'Client'}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    {!u.isAdmin && (
                      <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => handleDelete(u._id)}>
                        🗑️ Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}