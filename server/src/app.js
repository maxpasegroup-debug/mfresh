import cors from 'cors';
import express from 'express';
import { existsSync } from 'fs';
import helmet from 'helmet';
import { join } from 'path';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authLimiter, globalLimiter, otpLimiter } from './middleware/rateLimiter.js';

const app = express();
const clientBuildPath = join(process.cwd(), 'client/dist');
const allowedOrigins = ['http://localhost:5173', process.env.CLIENT_URL].filter(Boolean);

app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
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

if (process.env.NODE_ENV === 'production' && existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(clientBuildPath, 'index.html'));
    }
  });
  console.log('Serving React build from', clientBuildPath);
}

app.use(errorHandler);

export default app;
