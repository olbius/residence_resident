# Residence Resident Portal - Complete Component Code

This document contains all the code needed to complete the resident portal application.

## Pages

### src/pages/Login.jsx
```jsx
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
```

### src/pages/Dashboard.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { myFamilyApi, myFinancialApi, myVehiclesApi } from '../services/residentApi';
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation();
  const [family, setFamily] = useState(null);
  const [balance, setBalance] = useState(null);
  const [vehicles, setVehicles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [familyRes, balanceRes, vehiclesRes] = await Promise.all([
        myFamilyApi.getFamily(),
        myFinancialApi.getBalance(),
        myVehiclesApi.getVehicles()
      ]);
      
      setFamily(familyRes.data);
      setBalance(balanceRes.data);
      setVehicles(vehiclesRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <div className="page-container"><div className="loading">{t('common.loading')}</div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{t('dashboard.title')}</h1>
      </div>

      <div className="info-card">
        <h2>{t('dashboard.familyInfo')}</h2>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">{t('dashboard.unit')}</div>
            <div className="info-value">{family?.unitNumber || '-'}</div>
          </div>
          <div className="info-item">
            <div className="info-label">{t('dashboard.building')}</div>
            <div className="info-value">{family?.buildingBlock || '-'}</div>
          </div>
          <div className="info-item">
            <div className="info-label">{t('dashboard.floor')}</div>
            <div className="info-value">{family?.floor || '-'}</div>
          </div>
          <div className="info-item">
            <div className="info-label">{t('dashboard.area')}</div>
            <div className="info-value">{family?.area || '-'} m²</div>
          </div>
          <div className="info-item">
            <div className="info-label">{t('dashboard.moveInDate')}</div>
            <div className="info-value">{formatDate(family?.moveInDate)}</div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">{t('dashboard.outstandingBalance')}</div>
          <div className="stat-value">{formatCurrency(balance?.outstandingBalance)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t('dashboard.totalInvoices')}</div>
          <div className="stat-value">{balance?.invoiceCount || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t('dashboard.vehicles')}</div>
          <div className="stat-value">{vehicles?.vehicleCount || 0}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
```

### src/pages/Invoices.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { myFinancialApi } from '../services/residentApi';
import { useTranslation } from 'react-i18next';

function Invoices() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await myFinancialApi.getInvoices();
      setInvoices(response.data.invoiceList || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <div className="page-container"><div className="loading">{t('common.loading')}</div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{t('invoices.title')}</h1>
      </div>

      {invoices.length === 0 ? (
        <div className="no-data">{t('invoices.noInvoices')}</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('invoices.invoiceNumber')}</th>
                <th>{t('invoices.date')}</th>
                <th>{t('invoices.dueDate')}</th>
                <th>{t('invoices.amount')}</th>
                <th>{t('invoices.status')}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.invoiceId}>
                  <td>{invoice.invoiceId}</td>
                  <td>{formatDate(invoice.invoiceDate)}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                  <td>{formatCurrency(invoice.invoiceTotal)}</td>
                  <td>
                    <span className={`status-badge status-${invoice.statusId?.toLowerCase()}`}>
                      {invoice.statusId}
                    </span>
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

export default Invoices;
```

### src/pages/Payments.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { myFinancialApi } from '../services/residentApi';
import { useTranslation } from 'react-i18next';

function Payments() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await myFinancialApi.getPayments();
      setPayments(response.data.paymentList || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <div className="page-container"><div className="loading">{t('common.loading')}</div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{t('payments.title')}</h1>
      </div>

      {payments.length === 0 ? (
        <div className="no-data">{t('payments.noPayments')}</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('payments.paymentDate')}</th>
                <th>{t('payments.amount')}</th>
                <th>{t('payments.method')}</th>
                <th>{t('payments.status')}</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.paymentId}>
                  <td>{formatDate(payment.effectiveDate)}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>{payment.paymentMethodEnumId || '-'}</td>
                  <td>
                    <span className={`status-badge status-${payment.statusId?.toLowerCase()}`}>
                      {payment.statusId}
                    </span>
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

export default Payments;
```

### src/pages/Vehicles.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { myVehiclesApi } from '../services/residentApi';
import { useTranslation } from 'react-i18next';

function Vehicles() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await myVehiclesApi.getVehicles();
      setVehicles(response.data.vehicleList || []);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getVehicleTypeLabel = (enumId) => {
    const typeMap = {
      VhtCar: t('vehicles.types.car'),
      VhtMotorcycle: t('vehicles.types.motorcycle'),
      VhtEbike: t('vehicles.types.ebike'),
      VhtBicycle: t('vehicles.types.bicycle'),
    };
    return typeMap[enumId] || enumId;
  };

  if (loading) {
    return <div className="page-container"><div className="loading">{t('common.loading')}</div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{t('vehicles.title')}</h1>
      </div>

      {vehicles.length === 0 ? (
        <div className="no-data">{t('vehicles.noVehicles')}</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('vehicles.type')}</th>
                <th>{t('vehicles.plateNumber')}</th>
                <th>{t('vehicles.brand')}</th>
                <th>{t('vehicles.model')}</th>
                <th>{t('vehicles.parkingSpot')}</th>
                <th>{t('vehicles.monthlyFee')}</th>
                <th>{t('vehicles.status')}</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(vehicle => (
                <tr key={vehicle.vehicleId}>
                  <td>{getVehicleTypeLabel(vehicle.vehicleTypeEnumId)}</td>
                  <td><strong>{vehicle.plateNumber}</strong></td>
                  <td>{vehicle.vehicleBrand || '-'}</td>
                  <td>{vehicle.vehicleModel || '-'}</td>
                  <td>{vehicle.parkingSpotNumber || '-'}</td>
                  <td>{formatCurrency(vehicle.monthlyFee)}</td>
                  <td>
                    <span className={`status-badge status-${vehicle.statusEnumId?.toLowerCase()}`}>
                      {vehicle.statusEnumId}
                    </span>
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

export default Vehicles;
```

## Components

### src/components/Layout.jsx
```jsx
import React from 'react';
import { Link, Outlet, useNavigate, NavLink } from 'react-router-dom';
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
```

### src/components/ProtectedRoute.jsx
```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

## App & Config Files

### src/App.jsx
```jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Vehicles from './pages/Vehicles';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="payments" element={<Payments />} />
            <Route path="vehicles" element={<Vehicles />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

### src/main.jsx
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n/config';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/rest': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

### index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resident Portal</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## To Complete Setup:

1. Copy each code block above into its respective file
2. Run `npm run dev` to start the development server
3. Access at http://localhost:3001

The application is now complete and ready to use!
