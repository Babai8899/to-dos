import mongoose from "mongoose";

const eventCounterSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true,
        unique: true,
    },
    count: {
        type: Number,
        default: 0,
    }
});

const EventCounterModel = mongoose.model("EventCounter", eventCounterSchema);
export default EventCounterModel;