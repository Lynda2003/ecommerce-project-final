import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['Tous', 'Chaussures', 'Vetements', 'Accessoires', 'Electronique', 'Beaute'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Tous');
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let url = `/products?page=${page}`;
      if (keyword) url += `&keyword=${keyword}`;
      if (category !== 'Tous') url += `&category=${category}`;
      const { data } = await api.get(url);
      setProducts(data.products);
      setPages(data.pages);
      setTotal(data.total);
      setLoading(false);
    };
    fetchProducts();
  }, [category, keyword, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(search);
    setPage(1);
  };

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="container">
          <h1>Notre Boutique</h1>
          <p>{total} produits disponibles</p>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">🔍 Rechercher</button>
          </form>
        </div>
      </div>

      <div className="container products-body">
        <aside className="filters">
          <h3>Catégories</h3>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => { setCategory(cat); setPage(1); }}
            >
              {cat}
              {cat === 'Tous' && <span className="filter-count">{total}</span>}
            </button>
          ))}
        </aside>

        <main className="products-main">
          {keyword && (
            <div className="search-result">
              Résultats pour "<strong>{keyword}</strong>"
              <button onClick={() => { setKeyword(''); setSearch(''); }}>✕ Effacer</button>
            </div>
          )}

          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div className="no-products">
              <p>😕 Aucun produit trouvé</p>
              <button className="btn btn-outline" onClick={() => { setKeyword(''); setSearch(''); setCategory('Tous'); }}>
                Voir tous les produits
              </button>
            </div>
          ) : (
            <div className="grid-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`page-btn ${page === p ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}