import cors from 'cors';
import express from 'express';
import { existsSync } from 'fs';
import helmet from 'helmet';
import { resolve } from 'path';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authLimiter, globalLimiter, otpLimiter } from './middleware/rateLimiter.js';

const app = express();
const clientBuildCandidates = [
  resolve(process.cwd(), 'client/dist'),
  resolve(process.cwd(), '../client/dist'),
];
const clientBuildPath =
  clientBuildCandidates.find((candidate) => existsSync(candidate)) || clientBuildCandidates[0];
const allowedOrigins = buildAllowedOrigins([
  'http://localhost:5173',
  'http://localhost:5000',
  process.env.CLIENT_URL,
  process.env.CORS_ORIGINS,
  process.env.RAILWAY_PUBLIC_DOMAIN,
  process.env.RAILWAY_STATIC_URL,
]);

function normalizeOrigin(value) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim().replace(/\/+$/, '');

  if (!trimmed) {
    return null;
  }

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    return url.origin;
  } catch {
    return null;
  }
}

function buildAllowedOrigins(values) {
  return new Set(
    values
      .flatMap((value) => String(value || '').split(','))
      .map(normalizeOrigin)
      .filter(Boolean),
  );
}

function isAllowedOrigin(origin) {
  const normalizedOrigin = normalizeOrigin(origin);

  if (!normalizedOrigin) {
    return true;
  }

  const { hostname } = new URL(normalizedOrigin);

  return allowedOrigins.has(normalizedOrigin) || hostname.endsWith('.up.railway.app');
}

app.set('trust proxy', 1);
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
app.use(
  cors({
    origin: (origin, cb) => {
      if (isAllowedOrigin(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(globalLimiter);
app.use('/api/auth/send-otp', otpLimiter);
app.use('/api/auth', authLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'malabarii-api' });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

app.use('/api', routes);

if (existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }

    res.sendFile(resolve(clientBuildPath, 'index.html'));
  });
  console.log('Serving React build from', clientBuildPath);
}

app.use(errorHandler);

export default app;
