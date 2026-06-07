# MFresh

> Love From Malabar - fish-first direct-to-customer seafood commerce platform.

MFresh is a mobile-first web platform for ordering fresh seafood, choosing weight, selecting cleaning style, picking delivery slots, and buying the exclusive MFresh Pickles line.

## Features

- Fresh seafood storefront
- Weight and cleaning preferences
- Delivery slot selection
- MFresh Pickles category
- Admin panel
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

## Local Development

```bash
git clone <repo>
cd mfresh
npm install

cp .env.example .env

npm run db:migrate
npm run db:seed

npm run dev
```

Client: `http://localhost:5173`
Server: `http://localhost:5000`

## Default Login After Seed

| Role | Mobile | PIN |
| --- | --- | --- |
| Admin | 9999999999 | 0000 |

Change the admin PIN immediately after first login.

## Railway Deployment

```bash
npm run build
railway up
railway run npm run db:migrate
railway run npm run db:seed
```

## Common Scripts

```bash
npm run dev
npm run build
npm run lint
npm test --workspace server
npm run db:migrate
npm run db:seed
```
