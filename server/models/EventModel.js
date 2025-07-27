import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: String,
        required: true,
    }
});

const EventModel = mongoose.model("Event", eventSchema);

export default EventModel;
