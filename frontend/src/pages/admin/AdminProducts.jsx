import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './Admin.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', image: '', brand: '', category: '', description: '', countInStock: '' });

  const fetchProducts = async () => {
    const { data } = await api.get('/products');
    setProducts(data.products);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/products/${editing}`, form);
        toast.success('Produit mis à jour !');
      } else {
        await api.post('/products', form);
        toast.success('Produit créé !');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', price: '', image: '', brand: '', category: '', description: '', countInStock: '' });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({ name: product.name, price: product.price, image: product.image, brand: product.brand, category: product.category, description: product.description, countInStock: product.countInStock });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Produit supprimé');
    fetchProducts();
  };

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <div>
          <h1>🛍️ Gestion des Produits</h1>
          <p>{products.length} produits</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', price: '', image: '', brand: '', category: '', description: '', countInStock: '' }); }}>
          + Ajouter un produit
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 32 }}>
          <h2>{editing ? 'Modifier le produit' : 'Nouveau produit'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nom</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Marque</label>
                <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Prix (DT)</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Catégorie</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                <option value="">Choisir...</option>
                {['Chaussures', 'Vêtements', 'Accessoires', 'Électronique'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>URL Image</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary">{editing ? 'Mettre à jour' : 'Créer'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="spinner" /> : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.image} alt={p.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} /></td>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.category}</td>
                  <td>{p.price.toFixed(2)} DT</td>
                  <td>
                    <span className={`badge ${p.countInStock > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {p.countInStock}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => handleEdit(p)}>✏️</button>
                      <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => handleDelete(p._id)}>🗑️</button>
                    </div>
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