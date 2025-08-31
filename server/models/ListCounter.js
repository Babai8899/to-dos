import mongoose from "mongoose";

const listCounterSchema = new mongoose.Schema({
    listId: {
        type: String,
        required: true,
        unique: true,
    },
    count: {
        type: Number,
        default: 0,
    }
});

const ListCounterModel = mongoose.model("ListCounter", listCounterSchema);
export default ListCounterModel;
