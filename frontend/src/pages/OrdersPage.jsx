import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './OrdersPage.css';

const STATUS_COLORS = {
  pending: 'badge-warning',
  processing: 'badge-warning',
  shipped: 'badge-success',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
};

const STATUS_LABELS = {
  pending: '⏳ En attente',
  processing: '⚙️ En traitement',
  shipped: '🚚 Expédiée',
  delivered: '✅ Livrée',
  cancelled: '❌ Annulée',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="spinner" style={{ marginTop: 100 }} />;

  return (
    <div className="container orders-page">
      <h1 className="page-title">Mes Commandes</h1>
      <p className="page-subtitle">{orders.length} commande(s)</p>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>📦 Vous n'avez pas encore de commandes</p>
          <Link to="/products" className="btn btn-primary">Commencer vos achats</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <p className="order-id">Commande #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <span className={`badge ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="order-items">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                    <span className="order-item-qty">× {item.qty}</span>
                    <span className="order-item-price">{(item.price * item.qty).toFixed(3)} DT</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-info">
                  <span>💳 {order.paymentMethod}</span>
                  <span>📦 {order.shippingAddress?.city}, {order.shippingAddress?.country}</span>
                </div>
                <div className="order-total">
                  Total : <strong>{order.totalPrice.toFixed(3)} DT</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}