import mongoose from "mongoose";

const taskCounterSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: true,
        unique: true,
    },
    count: {
        type: Number,
        default: 0,
    }
});

const TaskCounterModel = mongoose.model("TaskCounter", taskCounterSchema);
export default TaskCounterModel;