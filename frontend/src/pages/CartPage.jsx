import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQty } from '../features/cartSlice';
import './CartPage.css';

export default function CartPage() {
  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shipping = subtotal > 150 ? 0 : 9.900;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    navigate('/checkout');
  };

  if (items.length === 0) return (
    <div className="cart-empty">
      <div className="empty-content">
        <div className="empty-icon">🛒</div>
        <h2>Votre panier est vide</h2>
        <p>Découvrez nos produits et ajoutez-les à votre panier</p>
        <Link to="/products" className="btn btn-primary">Voir les produits</Link>
      </div>
    </div>
  );

  return (
    <div className="container cart-page">
      <h1 className="page-title">Mon Panier</h1>
      <p className="page-subtitle">{items.length} article(s)</p>

      <div className="cart-grid">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <Link to={`/products/${item._id}`} className="cart-item-name">{item.name}</Link>
                <p className="cart-item-brand">{item.brand}</p>
                <p className="cart-item-price">{item.price.toFixed(3)} DT / unité</p>
              </div>
              <div className="cart-item-qty">
                <select
                  value={item.qty}
                  onChange={(e) => dispatch(updateQty({ id: item._id, qty: Number(e.target.value) }))}
                >
                  {Array.from({ length: Math.min(item.countInStock, 10) }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="cart-item-total">
                {(item.price * item.qty).toFixed(3)} DT
              </div>
              <button
                className="cart-item-remove"
                onClick={() => dispatch(removeFromCart(item._id))}
              >🗑️</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Résumé de la commande</h3>
          <div className="summary-row">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(3)} DT</span>
          </div>
          <div className="summary-row">
            <span>Livraison</span>
            <span>{shipping === 0 ? '🎉 Gratuite' : `${shipping.toFixed(3)} DT`}</span>
          </div>
          {shipping > 0 && (
            <p className="free-shipping-hint">
              Encore {(150 - subtotal).toFixed(3)} DT pour la livraison gratuite !
            </p>
          )}
          <div className="summary-total">
            <span>Total</span>
            <span>{total.toFixed(3)} DT</span>
          </div>
          <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
            Passer la commande →
          </button>
          <Link to="/products" className="continue-shopping">← Continuer les achats</Link>
        </div>
      </div>
    </div>
  );
}