import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress, clearCart } from '../features/cartSlice';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './CheckoutPage.css';

const STEPS = ['Livraison', 'Paiement', 'Confirmation'];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Tunisie');
  const [paymentMethod, setPaymentMethod] = useState('Paiement à la livraison');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shipping = subtotal > 150 ? 0 : 9.900;
  const tax = subtotal * 0.19;
  const total = subtotal + shipping + tax;

  const handleShipping = (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode) {
      return toast.error('Remplis tous les champs');
    }
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await api.post('/orders', {
        orderItems: items.map((i) => ({
          name: i.name,
          qty: i.qty,
          image: i.image,
          price: i.price,
          product: i._id,
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      });
      dispatch(clearCart());
      toast.success('Commande passée avec succès ! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande');
    }
    setLoading(false);
  };

  return (
    <div className="container checkout-page">
      <h1 className="page-title">Finaliser la commande</h1>

      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <div className="step-num">{i < step ? '✓' : i + 1}</div>
            <span>{s}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="checkout-grid">
        <div className="checkout-main">

          {step === 0 && (
            <div className="checkout-card">
              <h2>📦 Adresse de livraison</h2>
              <form onSubmit={handleShipping} className="checkout-form">
                <div className="form-group">
                  <label>Adresse complète</label>
                  <input
                    type="text"
                    placeholder="Rue, numéro, immeuble..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ville</label>
                    <input
                      type="text"
                      placeholder="Tunis, Sfax, Sousse..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Code postal</label>
                    <input
                      type="text"
                      placeholder="1000"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Pays</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="Tunisie">Tunisie</option>
                    <option value="Algérie">Algérie</option>
                    <option value="Maroc">Maroc</option>
                    <option value="France">France</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary checkout-btn">
                  Continuer vers le paiement →
                </button>
              </form>
            </div>
          )}

          {step === 1 && (
            <div className="checkout-card">
              <h2>💳 Mode de paiement</h2>
              <div className="payment-options">
                {[
                  { value: 'Paiement à la livraison', icon: '💵', desc: 'Payez en espèces à la réception' },
                  { value: 'Carte bancaire', icon: '💳', desc: 'Visa, Mastercard, CIB' },
                  { value: 'Virement bancaire', icon: '🏦', desc: 'Transfert depuis votre banque' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`payment-option ${paymentMethod === method.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="payment-icon">{method.icon}</span>
                    <div>
                      <p className="payment-name">{method.value}</p>
                      <p className="payment-desc">{method.desc}</p>
                    </div>
                    {paymentMethod === method.value && <span className="payment-check">✓</span>}
                  </label>
                ))}
              </div>
              <div className="checkout-actions">
                <button className="btn btn-outline" onClick={() => setStep(0)}>← Retour</button>
                <button className="btn btn-primary" onClick={() => setStep(2)}>
                  Vérifier la commande →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-card">
              <h2>✅ Confirmation</h2>
              <div className="confirm-section">
                <h3>📦 Adresse de livraison</h3>
                <p>{address}, {city} {postalCode}, {country}</p>
              </div>
              <div className="confirm-section">
                <h3>💳 Mode de paiement</h3>
                <p>{paymentMethod}</p>
              </div>
              <div className="confirm-section">
                <h3>🛍️ Articles commandés</h3>
                {items.map((item) => (
                  <div key={item._id} className="confirm-item">
                    <img src={item.image} alt={item.name} />
                    <span className="confirm-item-name">{item.name}</span>
                    <span className="confirm-item-qty">{item.qty} × {item.price.toFixed(3)} DT</span>
                    <span className="confirm-item-total"><strong>{(item.qty * item.price).toFixed(3)} DT</strong></span>
                  </div>
                ))}
              </div>
              <div className="checkout-actions">
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Retour</button>
                <button
                  className="btn btn-primary"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? 'Traitement...' : '🎉 Confirmer la commande'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Récapitulatif</h3>
          {items.map((item) => (
            <div key={item._id} className="summary-item">
              <img src={item.image} alt={item.name} className="summary-item-img" />
              <span className="summary-item-name">{item.name} × {item.qty}</span>
              <span className="summary-item-price">{(item.price * item.qty).toFixed(3)} DT</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row"><span>Sous-total</span><span>{subtotal.toFixed(3)} DT</span></div>
          <div className="summary-row">
            <span>Livraison</span>
            <span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>
              {shipping === 0 ? 'Gratuite 🎉' : `${shipping.toFixed(3)} DT`}
            </span>
          </div>
          <div className="summary-row"><span>TVA (19%)</span><span>{tax.toFixed(3)} DT</span></div>
          <div className="summary-total">
            <span>Total</span>
            <span>{total.toFixed(3)} DT</span>
          </div>
        </div>
      </div>
    </div>
  );
}