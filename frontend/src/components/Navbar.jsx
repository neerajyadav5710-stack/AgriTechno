import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Sprout, ShoppingCart, User, Globe, LogOut, ShieldAlert, Cpu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { lang, switchLanguage, t } = useLanguage();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: '#064e3b', borderBottom: '2px solid #059669' }}>
      <div className="container-fluid px-3 px-lg-4">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div className="bg-white p-1 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
            <Sprout size={24} className="text-success" />
          </div>
          <div>
            <span className="fw-bold tracking-tight text-white fs-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Agri<span style={{ color: '#fbbf24' }}>Techno</span>
            </span>
            <span className="badge ms-2 d-none d-sm-inline-block" style={{ backgroundColor: 'rgba(255,255,255,0.15)', fontSize: '0.65rem' }}>
              Precision Farming
            </span>
          </div>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Main Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white-50 hover-text-white px-2" to="/dashboard">
                    {t.nav.dashboard}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white-50 hover-text-white px-2" to="/farms">
                    {t.nav.farms}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white-50 hover-text-white px-2" to="/soil-analytics">
                    {t.nav.soil}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white-50 hover-text-white px-2" to="/crops">
                    {t.nav.crops}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white-50 hover-text-white px-2" to="/weather">
                    {t.nav.weather}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white-50 hover-text-white px-2" to="/marketplace">
                    {t.nav.marketplace}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white-50 hover-text-white px-2" to="/ask-doctor">
                    {t.nav.consultation}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white-50 hover-text-white px-2" to="/community">
                    {t.nav.forum}
                  </Link>
                </li>
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link px-2 text-warning fw-semibold d-flex align-items-center gap-1" to="/admin">
                      <ShieldAlert size={15} />
                      {t.nav.admin}
                    </Link>
                  </li>
                )}
              </>
            )}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white-50 px-2" to="/weather">
                    {t.nav.weather}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white-50 px-2" to="/marketplace">
                    {t.nav.marketplace}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white-50 px-2" to="/community">
                    {t.nav.forum}
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-3">
            {/* Language Switcher */}
            <div className="dropdown">
              <button
                className="btn btn-sm btn-outline-light d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                <Globe size={14} />
                <span>{lang === 'hi' ? 'हिन्दी' : lang === 'pa' ? 'ਪੰਜਾਬੀ' : lang === 'mr' ? 'मराठी' : 'English'}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li><button className="dropdown-item py-1" onClick={() => switchLanguage('en')}>English</button></li>
                <li><button className="dropdown-item py-1" onClick={() => switchLanguage('hi')}>हिन्दी (Hindi)</button></li>
                <li><button className="dropdown-item py-1" onClick={() => switchLanguage('pa')}>ਪੰਜਾਬੀ (Punjabi)</button></li>
                <li><button className="dropdown-item py-1" onClick={() => switchLanguage('mr')}>मराठी (Marathi)</button></li>
              </ul>
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="position-relative text-white p-1" title="View Cart">
              <ShoppingCart size={20} />
              {totalCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark font-weight-bold" style={{ fontSize: '0.68rem' }}>
                  {totalCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-sm text-white d-flex align-items-center gap-2 p-1 rounded-pill border border-secondary"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <img src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt="Avatar" className="rounded-circle" style={{ width: 26, height: 26, objectFit: 'cover' }} />
                  <span className="d-none d-md-inline text-truncate" style={{ maxWidth: 110, fontSize: '0.85rem' }}>
                    {user.name}
                  </span>
                  <span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'expert' ? 'bg-info text-dark' : 'bg-success'}`} style={{ fontSize: '0.65rem' }}>
                    {user.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                  <li className="px-3 py-2 border-bottom">
                    <div className="fw-bold text-dark">{user.name}</div>
                    <small className="text-muted">{user.email}</small>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      <User size={15} className="me-2 text-muted" /> {t.nav.dashboard}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/orders">
                      <ShoppingCart size={15} className="me-2 text-muted" /> Order History
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <LogOut size={15} className="me-2" /> {t.nav.logout}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-outline-light px-3 py-1 rounded-pill" style={{ fontSize: '0.85rem' }}>
                  {t.nav.login}
                </Link>
                <Link to="/register" className="btn btn-sm btn-warning px-3 py-1 rounded-pill fw-semibold" style={{ fontSize: '0.85rem' }}>
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
