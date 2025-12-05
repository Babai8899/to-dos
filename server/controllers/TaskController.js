import TaskModel from "../models/TaskModel.js";
import TaskCounterModel from "../models/TaskCounter.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createTask = async (req, res) => {
    console.log(req.body);
    const { title, description, date, time, user, priority = 'medium' } = req.body;

    console.log("Creating task with data:", { title, description, date, time, user, priority });
    // Validate required fields
    if (!title || !description || !date || !time || !user) {
        return res.status(400).json({ message: "All fields are required" });
    }
    //autogenerate _id as Task001 using TaskCounter
    let taskId;

    try {
        const counter = await TaskCounterModel.findOneAndUpdate(
            { taskId: "TASK001" },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        taskId = `TASK${String(counter.count).padStart(3, '0')}`;
    } catch (error) {
        console.error("Error generating task ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

    // Validate date is a valid date and not in the past
    const taskDate = new Date(date);
    if (isNaN(taskDate.getTime()) || taskDate < new Date()) {
        return res.status(400).json({ message: "Task date must be a valid date and not in the past" });
    }

    // Validate time is a valid time
    const taskTime = new Date(`${date} ${time}`);
    if (isNaN(taskTime.getTime())) {
        return res.status(400).json({ message: "Task time must be a valid time" });
    }

    try {
        // Create a new task instance
        
        const newTask = new TaskModel({
            taskId,
            title,
            description,
            date,
            time,
            user: user, // Assuming req.user is set by an authentication middleware
            status: 'pending',
            priority: priority
        });

        // Save the task to the database
        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getTaskById = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await TaskModel.findOne({ taskId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateTaskById = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, date, time, status, priority } = req.body;

    try {
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (date !== undefined) updateData.date = date;
        if (time !== undefined) updateData.time = time;
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) updateData.priority = priority;

        const task = await TaskModel.findOneAndUpdate({ taskId }, updateData, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteTaskById = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await TaskModel.findOneAndDelete({ taskId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getTasksByEmailId = async (req, res) => {
    const { emailId } = req.params;

    try {
        const tasks = await TaskModel.find({ user: emailId });
        // Generate CSV content in memory
        const csvHeader = 'taskId,title,description,date,time,status,priority,user\n';
        const csvRows = tasks.map(task => 
            `${task.taskId},${task.title},${task.description},${task.date},${task.time},${task.status || 'pending'},${task.priority || 'medium'},${task.user}`
        ).join('\n');
        const csvContent = csvHeader + csvRows;
        res.status(200).json({ tasks, csvContent });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export {
    createTask,
    getTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById,
    getTasksByEmailId
}