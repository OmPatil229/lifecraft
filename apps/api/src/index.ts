import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import questsRoutes from './routes/quests';
import characterRoutes from './routes/character';
import bossesRoutes from './routes/bosses';

const app = express();
const PORT = process.env.PORT || 3001; // Change to 3001 so frontend can use 3000 or vite defaults

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost, the explicit CLIENT_URL, or any vercel preview deployment
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/quests', questsRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/bosses', bossesRoutes);

app.get('/', (req, res) => {
  res.send('LIFECRAFT API running');
});

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifecraft';
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.warn('Failed to connect to primary MongoDB, falling back to in-memory database...', error);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      isConnected = true;
      console.log(`Connected to in-memory MongoDB at ${uri}`);
    } catch (memError) {
      console.error('Failed to start in-memory MongoDB:', memError);
      process.exit(1);
    }
  }
};

connectDB().then(() => {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
});

export default app;
