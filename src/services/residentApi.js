import axios from 'axios';

const API_BASE_URL = '/rest/s1/residence/my';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('moquiSessionToken');
  if (token) {
    config.headers['moquiSessionToken'] = token;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('moquiSessionToken');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// My Family API
export const myFamilyApi = {
  getFamily: () => apiClient.get('/family'),
  getMembers: () => apiClient.get('/members'),
};

// My Vehicles API
export const myVehiclesApi = {
  getVehicles: () => apiClient.get('/vehicles'),
};

// My Financial API
export const myFinancialApi = {
  getBalance: () => apiClient.get('/balance'),
  getInvoices: (params) => apiClient.get('/invoices', { params }),
  getInvoice: (invoiceId) => apiClient.get(`/invoices/${invoiceId}`),
  getPayments: (params) => apiClient.get('/payments', { params }),
  getAllocations: (params) => apiClient.get('/allocations', { params }),
};

export default apiClient;
