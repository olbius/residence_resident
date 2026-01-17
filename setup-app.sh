#!/bin/bash

# This script sets up the complete residence_resident application
# Run: chmod +x setup-app.sh && ./setup-app.sh

echo "Setting up Residence Resident Portal..."

# Create translation files
cat > src/i18n/locales/en.json << 'EOF'
{
  "app": {
    "title": "Resident Portal",
    "welcome": "Welcome"
  },
  "auth": {
    "login": "Login",
    "username": "Username",
    "password": "Password",
    "logout": "Logout",
    "loggingIn": "Logging in...",
    "loginError": "Login failed. Please check your credentials."
  },
  "nav": {
    "dashboard": "Dashboard",
    "invoices": "My Invoices",
    "payments": "My Payments",
    "vehicles": "My Vehicles"
  },
  "dashboard": {
    "title": "My Family Dashboard",
    "familyInfo": "Family Information",
    "unit": "Unit",
    "building": "Building",
    "floor": "Floor",
    "area": "Area (sqm)",
    "moveInDate": "Move-in Date",
    "members": "Family Members",
    "vehicles": "Registered Vehicles",
    "financialSummary": "Financial Summary",
    "outstandingBalance": "Outstanding Balance",
    "totalInvoices": "Total Invoices",
    "totalPayments": "Total Payments"
  },
  "invoices": {
    "title": "My Invoices",
    "invoiceNumber": "Invoice #",
    "date": "Date",
    "dueDate": "Due Date",
    "amount": "Amount",
    "status": "Status",
    "noInvoices": "No invoices found"
  },
  "payments": {
    "title": "My Payments",
    "paymentDate": "Payment Date",
    "amount": "Amount",
    "method": "Method",
    "status": "Status",
    "noPayments": "No payments found"
  },
  "vehicles": {
    "title": "My Registered Vehicles",
    "type": "Type",
    "plateNumber": "Plate Number",
    "brand": "Brand",
    "model": "Model",
    "parkingSpot": "Parking Spot",
    "monthlyFee": "Monthly Fee",
    "status": "Status",
    "noVehicles": "No vehicles registered",
    "types": {
      "car": "Car",
      "motorcycle": "Motorcycle",
      "ebike": "Electric Bike",
      "bicycle": "Bicycle"
    }
  },
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "back": "Back",
    "close": "Close"
  }
}
EOF

cat > src/i18n/locales/vi.json << 'EOF'
{
  "app": {
    "title": "Cổng Thông Tin Cư Dân",
    "welcome": "Chào mừng"
  },
  "auth": {
    "login": "Đăng nhập",
    "username": "Tên đăng nhập",
    "password": "Mật khẩu",
    "logout": "Đăng xuất",
    "loggingIn": "Đang đăng nhập...",
    "loginError": "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
  },
  "nav": {
    "dashboard": "Trang Chủ",
    "invoices": "Hóa Đơn",
    "payments": "Thanh Toán",
    "vehicles": "Phương Tiện"
  },
  "dashboard": {
    "title": "Thông Tin Gia Đình",
    "familyInfo": "Thông Tin Căn Hộ",
    "unit": "Căn hộ",
    "building": "Tòa nhà",
    "floor": "Tầng",
    "area": "Diện tích (m²)",
    "moveInDate": "Ngày chuyển đến",
    "members": "Thành viên",
    "vehicles": "Phương tiện đã đăng ký",
    "financialSummary": "Tổng Quan Tài Chính",
    "outstandingBalance": "Số tiền còn nợ",
    "totalInvoices": "Tổng hóa đơn",
    "totalPayments": "Tổng thanh toán"
  },
  "invoices": {
    "title": "Hóa Đơn Của Tôi",
    "invoiceNumber": "Số HĐ",
    "date": "Ngày",
    "dueDate": "Ngày đến hạn",
    "amount": "Số tiền",
    "status": "Trạng thái",
    "noInvoices": "Chưa có hóa đơn"
  },
  "payments": {
    "title": "Thanh Toán Của Tôi",
    "paymentDate": "Ngày thanh toán",
    "amount": "Số tiền",
    "method": "Phương thức",
    "status": "Trạng thái",
    "noPayments": "Chưa có thanh toán"
  },
  "vehicles": {
    "title": "Phương Tiện Đã Đăng Ký",
    "type": "Loại",
    "plateNumber": "Biển số",
    "brand": "Hãng",
    "model": "Dòng",
    "parkingSpot": "Chỗ đậu",
    "monthlyFee": "Phí tháng",
    "status": "Trạng thái",
    "noVehicles": "Chưa đăng ký phương tiện",
    "types": {
      "car": "Ô tô",
      "motorcycle": "Xe máy",
      "ebike": "Xe điện",
      "bicycle": "Xe đạp"
    }
  },
  "common": {
    "loading": "Đang tải...",
    "error": "Lỗi",
    "success": "Thành công",
    "back": "Quay lại",
    "close": "Đóng"
  }
}
EOF

echo "✓ Translation files created"

# Create CSS file
cat > src/index.css << 'EOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  background-color: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
}

.nav {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav h2 {
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.page-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.info-card h2 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  padding: 0.5rem 0;
}

.info-label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.info-value {
  color: #333;
  font-size: 1.1rem;
  margin-top: 0.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #667eea;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  color: #333;
  font-size: 2rem;
  font-weight: 700;
}

.table-container {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f8f9fa;
  color: #666;
  font-weight: 600;
  font-size: 0.9rem;
}

.data-table tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-active,
.status-vhsactive {
  background-color: #d4edda;
  color: #155724;
}

.status-paid {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #667eea;
  font-size: 1.1rem;
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.25rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.85rem;
}

.lang-btn.active {
  background-color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
}
EOF

echo "✓ CSS file created"
echo "✓ Setup complete! Now you can create the React components."
echo ""
echo "Remaining tasks:"
echo "1. Create pages (Login, Dashboard, Invoices, Payments, Vehicles)"
echo "2. Create Layout and ProtectedRoute components"
echo "3. Update App.jsx with routing"
echo "4. Update vite.config.js"
echo "5. Update index.html and main.jsx"
