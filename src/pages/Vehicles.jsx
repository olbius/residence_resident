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
                      {t(`vehicles.statusValues.${vehicle.statusEnumId}`, vehicle.statusEnumId)}
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
