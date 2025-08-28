
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';
import commentsRoutes from './routes/comments.js';
import path from 'path';
import createSocketServer from './socket.js';
import videoCallRoutes from './routes/videoCall.js';
import requestLogger from './middleware/requestLogger.js';

dotenv.config();

const app = express();

// Behind Vercel/Proxies (some features rely on this)
app.set('trust proxy', 1);

console.log("Mounting /express.json");
app.use(express.json({ limit: '1mb', extended: true }));
console.log("Mounting /express.urlencoded");
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// static uploads
console.log("Mounting /uploads");
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ---- CORS ----
const allowlist = [
  process.env.CORS_CLIENT_ORIGIN, // e.g. https://your-client.vercel.app
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    // Allow same-origin or server-to-server (no Origin header)
    if (!origin) return cb(null, true);
    if (allowlist.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};

console.log("Mounting /cors");
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

// optional: request logger you already have
console.log("Mounting /requestlogger");
app.use(requestLogger);

// Socket.io server wrapper
const { server, io } = createSocketServer(app);

// Routes
console.log("Mounting /user routes");
app.use('/user', userRoutes);
console.log("Mounting /video routes");
app.use('/video', videoRoutes);
console.log("Mounting /comment routes");
app.use('/comment', commentsRoutes);
console.log("Mounting /videoCall routes");
app.use('/videoCall', videoCallRoutes);

// Global error guard
console.log("Mounting /global error guard");
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('[UNCAUGHT ERROR]', err);
  res.status(500).json({ message: 'Internal error', errorId: Date.now() });
});

// Startup
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const DB_URL = process.env.CONNECTION_URL;
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
}).then(() => {
  console.log('MongoDB database connected');
}).catch((error) => {
  console.log(error);
});
