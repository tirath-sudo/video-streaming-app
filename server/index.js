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

app.use(express.json({ limit: '1mb', extended: true }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors({
  origin: true, 
  credentials: true
}));

const { server, io } = createSocketServer(app);

app.get('/', (req, res) => {
  res.send('hello');
});

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, time: new Date().toISOString() });
});

if (!process.env.JWT_SECRET) {
  console.warn('[WARN] JWT_SECRET is not set. Login will fail.');
} 

app.use('/user/login', requestLogger);

app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/comment', commentsRoutes);
app.use('/videoCall', videoCallRoutes);

app.use((err, req, res, next) => {
  console.error('[UNCAUGHT ERROR]', err);
  res.status(500).json({ message: 'Internal error', errorId: Date.now() });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server Running on the PORT ${PORT}`);
  console.log("Video Call Server is running on port 5000");
});

const DB_URL = process.env.CONNECTION_URL;
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log("MongoDB database connected");
  })
  .catch((error) => {
    console.log(error);
  });
