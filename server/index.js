import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import webpush from "web-push";
import EventModel from './models/EventModel.js';
import TaskModel from './models/TaskModel.js';

import authRoutes from './routes/AuthRoute.js';
import userRoutes from './routes/UserRoute.js';
import eventRoutes from './routes/EventRoute.js';
import taskRoutes from './routes/TaskRoute.js';
import noteRoutes from './routes/NoteRoute.js';
import listRoutes from './routes/ListRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const publicVapidKey = "BIGMDHupR8z8IgOdtcbYsUoAznXT6N3tGUxA0jg0lbwbTZ67hw0LG_svNCCiNnkSyrn_gjQXTN4LYDXroH9HpqY";
const privateVapidKey = "213RaiceqIxPBZPCSFVkvTzmckc-ZrgxSP44C_SXgQo";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todos';

app.use(cors({origin: ['https://to-dos-client.vercel.app', 'http://localhost:5173'], credentials: true}));
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
app.use('/api/notes', noteRoutes);
app.use('/api/lists', listRoutes);

webpush.setVapidDetails(
    "mailto:you@example.com",
    publicVapidKey,
    privateVapidKey
);

let subscriptions = [];

// Expect { subscription: <push subscription>, emailId: <user email> }
app.post("/api/subscribe", (req, res) => {
    const { subscription, emailId } = req.body;
    if (!subscription || !emailId) {
        return res.status(400).json({ message: "Subscription and emailId required" });
    }
    subscriptions.push({ subscription, emailId });
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

// Helper to get today's date string in YYYY-MM-DD format
function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Function to send notifications for today's events
async function sendTodayEventNotifications() {
    console.log("Checking for today's events to notify...");
    var todayStr = getTodayDateString();
    console.log("Today's date string:", todayStr);
    try {
        const events = await EventModel.find({ date: todayStr });
        console.log("Today's events:", events);
        if (events.length === 0) {
            console.log("No events today.");
        } else {
            for (const event of events) {
                const payload = JSON.stringify({
                    title: 'Event Today!',
                    body: `Event: ${event.title} at ${event.time} - ${event.location}`,
                    eventId: event.eventId
                });
                for (let sub of subscriptions) {
                    if (sub.emailId === event.user) {
                        try {
                            await webpush.sendNotification(sub.subscription, payload);
                        } catch (err) {
                            console.error("Push error:", err);
                        }
                    }
                }
            }
        }
        console.log("Sent event notifications");
        // Also send notifications for today's tasks
        const tasks = await TaskModel.find({ date: todayStr });
        console.log("Today's tasks:", tasks);
        for (const task of tasks) {
            console.log("Sending notification for task:", task);
            const payload = JSON.stringify({
                title: 'Task Today!',
                body: `Task: ${task.title} at ${task.time}`,
                taskId: task.taskId
            });
            for (let sub of subscriptions) {
                if (sub.emailId === task.user) {
                    try {
                        await webpush.sendNotification(sub.subscription, payload);
                    } catch (err) {
                        console.error("Push error:", err);
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error sending today event notifications:', err);
    }
}

// Run every day at 8:00 AM server time
function scheduleDailyNotifications() {
    const now = new Date();
    const next8am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 9, 0, 0);
    if (now > next8am) {
        next8am.setDate(next8am.getDate() + 1);
    }
    const msUntil8am = next8am - now;
    setTimeout(() => {
        sendTodayEventNotifications();
        setInterval(sendTodayEventNotifications, 24 * 60 * 60 * 1000);
    }, msUntil8am);
}

scheduleDailyNotifications();