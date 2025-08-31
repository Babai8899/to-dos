import ListModel from "../models/ListModel.js";
import ListCounterModel from "../models/ListCounter.js";

const createList = async (req, res) => {
    const { title, items, user } = req.body;
    if (!title || !items || !user) {
        return res.status(400).json({ message: "Title, items, and user are required" });
    }
    // Validate items array structure
    if (!Array.isArray(items) || items.some(item => typeof item.itemName !== 'string')) {
        return res.status(400).json({ message: "Each item must have itemName (string) and completed (boolean)" });
    }
    // Auto-generate listId as LIST001 using ListCounter
    let listId;
    try {
        const counter = await ListCounterModel.findOneAndUpdate(
            { listId: "LIST001" },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        listId = `LIST${String(counter.count).padStart(3, '0')}`;
    } catch (error) {
        console.error("Error generating list ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
    try {
        const newList = new ListModel({
            listId,
            title,
            items,
            user
        });
        await newList.save();
        return res.status(201).json(newList);
    } catch (error) {
        console.error("Error creating list:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getLists = async (req, res) => {
    try {
        const lists = await ListModel.find();
        res.status(200).json(lists);
    } catch (error) {
        console.error("Error fetching lists:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getListById = async (req, res) => {
    const { listId } = req.params;
    try {
        const list = await ListModel.findOne({ listId });
        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }
        res.status(200).json(list);
    } catch (error) {
        console.error("Error fetching list:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateListById = async (req, res) => {
    const { listId } = req.params;
    const { title, items } = req.body;
    // Validate items array structure
    if (!Array.isArray(items) || items.some(item => typeof item.itemName !== 'string' || typeof item.completed !== 'boolean')) {
        return res.status(400).json({ message: "Each item must have itemName (string) and completed (boolean)" });
    }
    try {
        const list = await ListModel.findOneAndUpdate({ listId }, { title, items }, { new: true });
        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }
        res.status(200).json(list);
    } catch (error) {
        console.error("Error updating list:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteListById = async (req, res) => {
    const { listId } = req.params;
    try {
        const list = await ListModel.findOneAndDelete({ listId });
        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }
        res.status(200).json({ message: "List deleted successfully" });
    } catch (error) {
        console.error("Error deleting list:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getListsByEmailId = async (req, res) => {
    const { emailId } = req.params;
    try {
        const lists = await ListModel.find({ user: emailId });
        res.status(200).json(lists);
    } catch (error) {
        console.error("Error fetching lists:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export {
    createList,
    getLists,
    getListById,
    updateListById,
    deleteListById,
    getListsByEmailId
};
