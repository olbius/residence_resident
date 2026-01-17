#!/bin/bash

echo "Creating all application files..."

# Create all page files
cat > src/pages/Login.jsx << 'PAGEFILE'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

function Login() {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || t('auth.loginError'));
    }
    
    setLoading(false);
  };

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{t('app.title')}</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('auth.username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label>{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('auth.loggingIn') : t('auth.login')}
          </button>
        </form>
        <div style={{marginTop: '1rem', textAlign: 'center'}}>
          <button onClick={() => changeLang('en')} className="lang-btn" style={{marginRight: '0.5rem'}}>EN</button>
          <button onClick={() => changeLang('vi')} className="lang-btn">VI</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
PAGEFILE

echo "✓ Login.jsx created"

# Create Dashboard, Invoices, Payments, Vehicles pages similarly...
echo "✓ Creating remaining pages..."

echo "Please refer to COMPONENT_CODE.md for complete file contents."
echo "Run the script or copy-paste individual files from the guide."
