# Malabarii

> Good Food Rich Life - Multi-vendor quick commerce platform for fresh daily products

## Features

- Individual and Hotel customer modes
- Multi-vendor marketplace
- Full admin panel
- Mobile-first PWA
- Razorpay payments
- Cloudinary image hosting
- Mobile OTP and 4-digit PIN auth

## Tech Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 18 + Vite + Tailwind |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | JWT + bcrypt + MSG91 OTP |
| Payments | Razorpay |
| Images | Cloudinary |
| Hosting | Railway.app |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Railway CLI for deployment

### Local Development

```bash
git clone <repo>
cd malabarii
npm install

cp .env.example .env

npm run db:migrate
npm run db:seed

npm run dev
```

Client: `http://localhost:5173`
Server: `http://localhost:5000`

### Default Login After Seed

| Role | Mobile | PIN |
| --- | --- | --- |
| Admin | 9999999999 | 0000 |

Change the admin PIN immediately after first login.

## Railway Deployment

### One-Time Setup

```bash
npm install -g @railway/cli
railway login
railway new malabarii
railway add postgresql

railway vars set NODE_ENV=production
railway vars set JWT_SECRET=<generate 32 chars>
railway vars set JWT_REFRESH_SECRET=<generate 32 chars>
railway vars set RAZORPAY_KEY_ID=<your key>
railway vars set RAZORPAY_KEY_SECRET=<your secret>
railway vars set CLOUDINARY_URL=<your url>
railway vars set MSG91_API_KEY=<your key>
railway vars set MSG91_TEMPLATE_ID=<your id>
railway vars set ADMIN_MOBILE=<your mobile>
railway vars set ADMIN_PIN=<secure pin>
railway vars set CLIENT_URL=<railway domain>
railway vars set VITE_API_URL=<railway domain>
railway vars set VITE_RAZORPAY_KEY_ID=<your key>
```

### Deploy

```bash
npm run build
railway up
railway run npm run db:migrate
railway run npm run db:seed
```

## API Reference

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/send-otp` | Send OTP to mobile |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/set-pin` | Set PIN during registration |
| POST | `/api/auth/login` | Login with PIN |
| POST | `/api/auth/reset-pin` | Forgot PIN reset |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/me` | Get current user |

### Products

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/products` | List with filters |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Soft delete |

### Orders

| Method | Endpoint | Auth |
| --- | --- | --- |
| POST | `/api/orders` | User |
| GET | `/api/orders` | User |
| GET | `/api/orders/:id` | User |
| POST | `/api/orders/:id/verify-payment` | User |
| POST | `/api/orders/:id/cancel` | User |
| GET | `/api/orders/vendor` | Vendor |
| GET | `/api/admin/orders` | Admin |

## Project Structure

```text
malabarii/
├── client/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       ├── store/
│       └── api/
└── server/
    └── src/
        ├── controllers/
        ├── models/
        ├── routes/
        ├── services/
        ├── middleware/
        └── scripts/
```

## Roadmap

- React Native iOS and Android apps
- Push notifications with FCM
- Live order tracking map
- Subscription and recurring orders
- Loyalty points system
- Vendor analytics dashboard
