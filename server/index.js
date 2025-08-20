import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/AuthRoute.js';
import userRoutes from './routes/UserRoute.js';
import eventRoutes from './routes/EventRoute.js';
import taskRoutes from './routes/TaskRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todos';

app.use(cors({origin: 'http://localhost:5173', credentials: true}));
app.use(cookieParser());
app.use(express.json());

mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);