import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import './config/passport';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(passport.initialize());

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});