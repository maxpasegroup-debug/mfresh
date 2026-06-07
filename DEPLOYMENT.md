# MFresh Deployment

## Railway

- Project name: `mfresh`
- PostgreSQL: Railway PostgreSQL service connected to the app service

Do not commit Railway database passwords or full connection strings.

## Required Environment Variables

- `DATABASE_URL`
- `NODE_ENV`
- `PORT`
- `CLIENT_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `ADMIN_MOBILE`
- `ADMIN_PIN`
- `MSG91_API_KEY`
- `MSG91_TEMPLATE_ID`
- `MSG91_SENDER_ID`
- `CLOUDINARY_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAYX_ACCOUNT_NUMBER`
- `VITE_API_URL`
- `VITE_RAZORPAY_KEY_ID`

## Common Railway Commands

```bash
railway logs --tail
railway run npm run db:migrate
railway run npm run db:seed
railway rollback
railway run <cmd>
```

## Add A New Admin

```bash
railway run node server/src/scripts/createAdmin.js <mobile> <pin>
```

## Deployment Flow

```bash
npm install
npm run lint
npm run build
npm test
railway up
railway run npm run db:migrate
railway run npm run db:seed
```
