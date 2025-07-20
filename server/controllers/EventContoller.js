import EventModel from "../models/EventModel.js";
import EventCounterModel from "../models/EventCounter.js";

const createEvent = async (req, res) => {
    const { title, description, date, location, user } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location || !user) {
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

    try {
        // Create a new event instance
        
        const newEvent = new EventModel({
            eventId,
            title,
            description,
            date: eventDate,
            location,
            user: user._id // Assuming req.user is set by an authentication middleware
        });

        // Save the event to the database
        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}