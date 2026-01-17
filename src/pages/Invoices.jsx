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
