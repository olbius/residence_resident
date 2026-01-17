import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div>
      <nav className="nav">
        <h2>{t('app.title')}</h2>
        <div className="nav-links">
          <NavLink to="/" end>{t('nav.dashboard')}</NavLink>
          <NavLink to="/invoices">{t('nav.invoices')}</NavLink>
          <NavLink to="/payments">{t('nav.payments')}</NavLink>
          <NavLink to="/vehicles">{t('nav.vehicles')}</NavLink>
        </div>
        <div className="nav-user">
          <div className="language-switcher">
            <button 
              onClick={() => changeLang('en')} 
              className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
            >
              EN
            </button>
            <button 
              onClick={() => changeLang('vi')} 
              className={`lang-btn ${i18n.language === 'vi' ? 'active' : ''}`}
            >
              VI
            </button>
          </div>
          <span>{user?.userFullName || user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            {t('auth.logout')}
          </button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Layout;
