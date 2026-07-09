import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './Admin.css';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get('/orders');
      setOrders(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Statut mis à jour !');
    } catch (err) {
      toast.error('Erreur');
    }
  };

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <h1>📦 Gestion des Commandes</h1>
        <p>{orders.length} commandes</p>
      </div>
      {loading ? <div className="spinner" /> : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name || 'N/A'}<br /><small style={{ color: 'var(--gray)' }}>{o.user?.email}</small></td>
                  <td>{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td><strong>{o.totalPrice.toFixed(3)} DT</strong></td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatus(o._id, e.target.value)}
                      className="status-select"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
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