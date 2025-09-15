import EventModel from "../models/EventModel.js";
import EventCounterModel from "../models/EventCounter.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createEvent = async (req, res) => {
    console.log(req.body);
    const { title, description, date, time, location, user } = req.body;

    // Validate required fields
    if (!title || !description || !date || !time || !location || !user) {
        return res.status(400).json({ message: "All fields are required" });
    }
    //autogenerate _id as EVENT001 using EventCounter
    let eventId;

    try {
        const counter = await EventCounterModel.findOneAndUpdate(
            { eventId: "EVENT001" },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        eventId = `EVENT${String(counter.count).padStart(3, '0')}`;
    } catch (error) {
        console.error("Error generating event ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

    // Validate date is a valid date and not in the past
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
        return res.status(400).json({ message: "Event date must be a valid date and not in the past" });
    }

    // Validate time is a valid time
    const eventTime = new Date(`${date} ${time}`);
    if (isNaN(eventTime.getTime())) {
        return res.status(400).json({ message: "Event time must be a valid time" });
    }

    try {
        // Create a new event instance
        
        const newEvent = new EventModel({
            eventId,
            title,
            description,
            date,
            time,
            location,
            user: user // Assuming req.user is set by an authentication middleware
        });

        // Save the event to the database
        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getEvents = async (req, res) => {
    try {
        const events = await EventModel.find();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getEventById = async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await EventModel.findOne({ eventId });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateEventById = async (req, res) => {
    const { eventId } = req.params;
    const { title, description, date, location } = req.body;

    try {
        const event = await EventModel.findOneAndUpdate({ eventId }, { title, description, date, location }, { new: true });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteEventById = async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await EventModel.findOneAndDelete({ eventId });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getEventsByEmailId = async (req, res) => {
    console.log(req.params);
    const { emailId } = req.params;

    try {
        const events = await EventModel.find({ user: emailId });
        // Generate CSV content in memory
        const csvHeader = 'eventId,title,description,date,time,location,user\n';
        const csvRows = events.map(event => 
            `${event.eventId},${event.title},${event.description},${event.date},${event.time},${event.location},${event.user}`
        ).join('\n');
        const csvContent = csvHeader + csvRows;
        res.status(200).json({ events, csvContent });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export {
    createEvent,
    getEvents,
    getEventById,
    updateEventById,
    deleteEventById,
    getEventsByEmailId
}