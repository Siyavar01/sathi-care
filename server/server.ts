import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import professionalRoutes from './routes/professionalRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import questionnaireRoutes from './routes/questionnaireRoutes.js';
import institutionRoutes from './routes/institutionRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import aiRoutes from './routes/aiRoutes.js'
import resourceRoutes from './routes/resourceRoutes.js'
import { errorHandler } from './middleware/errorMiddleware.js';
import './config/passport.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

const corsOptions = {
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(passport.initialize());

app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resources', resourceRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

declare global {
    namespace Express {
        interface Request {
            io: Server;
        }
    }
}