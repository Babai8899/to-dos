import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import webpush from "web-push";

import authRoutes from './routes/AuthRoute.js';
import userRoutes from './routes/UserRoute.js';
import eventRoutes from './routes/EventRoute.js';
import taskRoutes from './routes/TaskRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const publicVapidKey = "BIGMDHupR8z8IgOdtcbYsUoAznXT6N3tGUxA0jg0lbwbTZ67hw0LG_svNCCiNnkSyrn_gjQXTN4LYDXroH9HpqY";
const privateVapidKey = "213RaiceqIxPBZPCSFVkvTzmckc-ZrgxSP44C_SXgQo";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todos';

// app.use(cors({origin: 'https://to-dos-client.vercel.app', credentials: true}));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
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

app.set('trust proxy', 1); // trust first proxy

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);

webpush.setVapidDetails(
    "mailto:you@example.com",
    publicVapidKey,
    privateVapidKey
);

let subscriptions = [];

app.post("/api/subscribe", (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

app.post("/api/send", async (req, res) => {
    

    const inMessage = req.body;

    const payload = JSON.stringify(inMessage);

    for (let sub of subscriptions) {
        try {
            await webpush.sendNotification(sub, payload);
        } catch (err) {
            console.error("Push error:", err);
        }
    }
    res.send("Notifications sent");
});