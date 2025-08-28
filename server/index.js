// server/index.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';
import commentsRoutes from './routes/comments.js';
import videoCallRoutes from './routes/videoCall.js';
import requestLogger from './middleware/requestLogger.js';

dotenv.config(); // OK in dev; in Vercel prefer project env vars

const app = express();
app.set('trust proxy', 1);

// Basic parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static uploads (if you use this)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// CORS: allow comma-separated list in CORS_CLIENT_ORIGIN env var
const clientOrigins = (process.env.CORS_CLIENT_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const allowlist = [
  ...clientOrigins,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowlist.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};

app.use(cors(corsOptions));
app.use(requestLogger);

// Quick health endpoint to inspect env presence and DB connectivity state
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    env: {
      jwt_present: !!(process.env.JWT_SECRET || process.env.SECRET),
      mongo_url_present: !!(process.env.MONGO_URI || process.env.CONNECTION_URL || process.env.MONGODB_URI)
    },
  });
});

// Mount routers
app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/comment', commentsRoutes);
app.use('/videoCall', videoCallRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error('[UNCAUGHT ERROR]', err && err.stack ? err.stack : err);
  res.status(500).json({ message: 'Internal server error', detail: err?.message });
});

// Startup: ensure DB is connected before listening.
// Look for MONGO_URI or CONNECTION_URL or MONGODB_URI
const DB_URL = process.env.MONGO_URI || process.env.CONNECTION_URL || process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

async function start() {
  // 1) required env checks
  if (!DB_URL) {
    console.error('[STARTUP] Missing MongoDB connection string. Set MONGO_URI or CONNECTION_URL or MONGODB_URI in environment.');
    process.exit(1);
  }

  try {
    console.log('[STARTUP] Connecting to MongoDB...');
    // Note: do not pass legacy options that mongoose warns about
    await mongoose.connect(DB_URL);
    console.log('[STARTUP] MongoDB connected.');
  } catch (err) {
    console.error('[STARTUP] MongoDB connection failed:', err && err.message ? err.message : err);
    process.exit(1);
  }

  if (!(process.env.JWT_SECRET || process.env.SECRET)) {
    console.warn('[STARTUP] WARNING: JWT_SECRET or SECRET not set — login/token generation will fail.');
    // we do not exit, but it's logged loudly
  } else {
    console.log('[STARTUP] JWT secret found.');
  }

  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  server.on('error', (err) => {
    console.error('[SERVER] Listen error', err);
    process.exit(1);
  });
}

process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
  process.exit(1);
});

start();
