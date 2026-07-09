import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: [], products: [], users: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [orders, products, users] = await Promise.all([
        api.get('/orders'),
        api.get('/products'),
        api.get('/users'),
      ]);
      setStats({
        orders: orders.data,
        products: products.data.products,
        users: users.data,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="spinner" style={{ marginTop: 100 }} />;

  const revenue = stats.orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const recentOrders = stats.orders.slice(0, 5);

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <h1>🎛️ Dashboard Admin</h1>
        <p>Bienvenue dans votre espace d'administration</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Chiffre d\'affaires', value: `${revenue.toFixed(3)} DT`, icon: '💰', color: '#6C63FF' },
          { label: 'Commandes', value: stats.orders.length, icon: '📦', color: '#10b981' },
          { label: 'Produits', value: stats.products.length, icon: '🛍️', color: '#f59e0b' },
          { label: 'Clients', value: stats.users.length, icon: '👥', color: '#FF6584' },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ background: stat.color }}>{stat.icon}</div>
            <div>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Dernières commandes</h2>
            <Link to="/admin/orders" className="see-all-link">Voir tout →</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-6).toUpperCase()}</td>
                  <td>{o.user?.name || 'N/A'}</td>
                  <td><strong>{o.totalPrice.toFixed(3)} DT</strong></td>
                  <td>
                    <span className={`badge ${o.status === 'delivered' ? 'badge-success' : o.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-shortcuts">
          <h2>Actions rapides</h2>
          {[
            { to: '/admin/products', icon: '🛍️', label: 'Gérer les produits' },
            { to: '/admin/orders', icon: '📦', label: 'Gérer les commandes' },
            { to: '/admin/users', icon: '👥', label: 'Gérer les clients' },
          ].map((s) => (
            <Link key={s.to} to={s.to} className="shortcut-card">
              <span className="shortcut-icon">{s.icon}</span>
              <span>{s.label}</span>
              <span>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}