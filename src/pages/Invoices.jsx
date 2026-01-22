import React, { useState, useEffect } from 'react';
import { myFinancialApi } from '../services/residentApi';
import { useTranslation } from 'react-i18next';

function Invoices() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

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

  const loadInvoiceDetail = async (invoice) => {
    setLoadingItems(true);
    try {
      const response = await myFinancialApi.getInvoice(invoice.invoiceId);
      const fullInvoice = response.data;
      setSelectedInvoice(fullInvoice);
      setInvoiceItems(fullInvoice.items || []);
    } catch (error) {
      console.error('Error loading invoice details:', error);
      setSelectedInvoice(invoice);
      setInvoiceItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const closeModal = () => {
    setSelectedInvoice(null);
    setInvoiceItems([]);
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
                <tr 
                  key={invoice.invoiceId} 
                  onClick={() => loadInvoiceDetail(invoice)}
                  className="clickable-row"
                >
                  <td>{invoice.invoiceId}</td>
                  <td>{formatDate(invoice.invoiceDate)}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                  <td>{formatCurrency(invoice.invoiceTotal)}</td>
                  <td>
                    <span className={`status-badge status-${invoice.statusId?.toLowerCase()}`}>
                      {t(`invoices.statusValues.${invoice.statusId}`, invoice.statusId)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedInvoice && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('invoices.invoiceDetail')}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="invoice-summary">
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">{t('invoices.invoiceNumber')}</div>
                    <div className="info-value">{selectedInvoice.invoiceId}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">{t('invoices.date')}</div>
                    <div className="info-value">{formatDate(selectedInvoice.invoiceDate)}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">{t('invoices.dueDate')}</div>
                    <div className="info-value">{formatDate(selectedInvoice.dueDate)}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">{t('invoices.status')}</div>
                    <div className="info-value">
                      <span className={`status-badge status-${selectedInvoice.statusId?.toLowerCase()}`}>
                        {t(`invoices.statusValues.${selectedInvoice.statusId}`, selectedInvoice.statusId)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h3>{t('invoices.items')}</h3>
              {loadingItems ? (
                <div className="loading">{t('common.loading')}</div>
              ) : invoiceItems.length === 0 ? (
                <div className="no-data">{t('invoices.noItems')}</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('invoices.itemDescription')}</th>
                      <th>{t('invoices.quantity')}</th>
                      <th>{t('invoices.unitPrice')}</th>
                      <th>{t('invoices.itemAmount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item, index) => {
                      const qty = item.quantity || 1;
                      const unitPrice = item.amount || 0;
                      const totalAmount = qty * unitPrice;
                      return (
                        <tr key={item.invoiceItemSeqId || index}>
                          <td>{item.description || item.itemTypeEnumId || '-'}</td>
                          <td>{qty}</td>
                          <td>{formatCurrency(unitPrice)}</td>
                          <td>{formatCurrency(totalAmount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="total-label">{t('invoices.total')}</td>
                      <td className="total-value">{formatCurrency(selectedInvoice.invoiceTotal)}</td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoices;
