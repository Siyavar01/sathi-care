import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import professionalRoutes from './routes/professionalRoutes';
import adminRoutes from './routes/adminRoutes';
import questionnaireRoutes from './routes/questionnaireRoutes';
import './config/passport';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(passport.initialize());

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/questionnaire', questionnaireRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});