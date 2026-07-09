import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [dropOpen, setDropOpen] = useState(false);

  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.user-dropdown')) {
        setDropOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/products?search=${searchQ}`);
      setSearchOpen(false);
      setSearchQ('');
    }
  };

  const cartCount = items.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">

          <Link to="/" className="logo">
            <div className="logo-icon">S</div>
            <span>ShopTN</span>
          </Link>

          <div className="nav-center">
            <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
              Accueil
            </Link>
            <Link to="/products" className={location.pathname.includes('/products') ? 'nav-link active' : 'nav-link'}>
              Boutique
            </Link>
            <Link to="/shop" className={location.pathname === '/shop' ? 'nav-link active' : 'nav-link'}>
              Nouveautés
            </Link>
          </div>

          <div className="nav-actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} title="Rechercher">
              🔍
            </button>

            <Link to="/cart" className="cart-icon-btn">
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="user-dropdown">
                <div className="user-trigger" onClick={() => setDropOpen(!dropOpen)}>
                  <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <span className="user-name-nav">{user.name.split(' ')[0]}</span>
                  <span>{dropOpen ? '▴' : '▾'}</span>
                </div>

                {dropOpen && (
                  <div className="dropdown-menu open">
                    <div className="dropdown-header">
                      <p className="dh-name">{user.name}</p>
                      <p className="dh-email">{user.email}</p>
                    </div>
                    <div className="dropdown-body">
                      <Link to="/profile" className="dd-item" onClick={() => setDropOpen(false)}>
                        👤 Mon profil
                      </Link>
                      <Link to="/orders" className="dd-item" onClick={() => setDropOpen(false)}>
                        📦 Mes commandes
                      </Link>
                      <Link to="/cart" className="dd-item" onClick={() => setDropOpen(false)}>
                        🛒 Mon panier
                        {cartCount > 0 && (
                          <span className="dd-badge">{cartTotal.toFixed(3)} DT</span>
                        )}
                      </Link>
                      {user.isAdmin && (
                        <>
                          <div className="dd-divider" />
                          <Link to="/admin" className="dd-item admin" onClick={() => setDropOpen(false)}>
                            🎛️ Dashboard Admin
                          </Link>
                          <Link to="/admin/products" className="dd-item admin" onClick={() => setDropOpen(false)}>
                            🛍️ Produits
                          </Link>
                          <Link to="/admin/orders" className="dd-item admin" onClick={() => setDropOpen(false)}>
                            📋 Commandes
                          </Link>
                          <Link to="/admin/users" className="dd-item admin" onClick={() => setDropOpen(false)}>
                            👥 Utilisateurs
                          </Link>
                        </>
                      )}
                      <div className="dd-divider" />
                      <button
                        onClick={() => { handleLogout(); setDropOpen(false); }}
                        className="dd-item logout"
                      >
                        🚪 Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="btn btn-ghost btn-sm">Connexion</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Inscription</Link>
              </div>
            )}

            <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="mobile-link">🏠 Accueil</Link>
          <Link to="/products" className="mobile-link">🛍️ Boutique</Link>
          <Link to="/shop" className="mobile-link">✨ Nouveautés</Link>
          <Link to="/cart" className="mobile-link">🛒 Panier ({cartCount})</Link>
          {user ? (
            <>
              <Link to="/profile" className="mobile-link">👤 Mon profil</Link>
              <Link to="/orders" className="mobile-link">📦 Mes commandes</Link>
              {user.isAdmin && (
                <>
                  <Link to="/admin" className="mobile-link">🎛️ Dashboard Admin</Link>
                  <Link to="/admin/products" className="mobile-link">🛍️ Produits</Link>
                  <Link to="/admin/orders" className="mobile-link">📋 Commandes</Link>
                  <Link to="/admin/users" className="mobile-link">👥 Utilisateurs</Link>
                </>
              )}
              <button onClick={handleLogout} className="mobile-link mobile-logout">
                🚪 Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link">🔑 Connexion</Link>
              <Link to="/register" className="mobile-link">✨ Inscription</Link>
            </>
          )}
        </div>
      </nav>

      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch}>
              <input
                autoFocus
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-primary">Rechercher</button>
              <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>✕</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}