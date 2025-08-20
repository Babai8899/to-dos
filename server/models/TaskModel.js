import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskId: {
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
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    }
});

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;
