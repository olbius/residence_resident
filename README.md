# Residence Resident Portal

A self-service portal for residence residents to view their family information, invoices, payments, and registered vehicles.

## Features

- **Dashboard**: Overview of family information and financial summary
- **Invoices**: View all invoices with status and amounts
- **Payments**: Track all payments made
- **Vehicles**: View registered vehicles and parking information
- **Bilingual**: Full support for English and Vietnamese
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Internationalization**: i18next, react-i18next
- **Backend API**: Moqui Framework REST services

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Moqui Framework backend running on http://localhost:8080

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at **http://localhost:3001**

### Build for Production

```bash
npm run build
npm run preview
```

## Backend API Endpoints

- `GET /rest/s1/residence/my/family` - Family information
- `GET /rest/s1/residence/my/invoices` - Invoices
- `GET /rest/s1/residence/my/payments` - Payments
- `GET /rest/s1/residence/my/vehicles` - Vehicles
- `GET /rest/s1/residence/my/balance` - Outstanding balance

## Docker Deployment

Pre-built Docker images are available:

```bash
docker pull fndocker/residence_resident:latest
docker run -d -p 3001:80 fndocker/residence_resident:latest
```

See [DOCKER.md](DOCKER.md) for detailed Docker deployment instructions.

## License

Part of the Residence Management System.
