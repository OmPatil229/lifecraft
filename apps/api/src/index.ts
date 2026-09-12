import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import questsRoutes from './routes/quests';
import characterRoutes from './routes/character';
import bossesRoutes from './routes/bosses';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Change to 3001 so frontend can use 3000 or vite defaults

app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
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

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifecraft';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
