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
