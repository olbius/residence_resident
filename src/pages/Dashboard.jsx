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
