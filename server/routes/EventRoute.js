import { Router } from "express";
import { createEvent, getEventsByEmailId, getEvents, getEventById, deleteEventById, updateEventById } from "../controllers/EventContoller.js";

const router = Router();

router.post('/', createEvent);
router.get('/', getEvents);
router.get('/:eventId', getEventById);
router.put('/:eventId', updateEventById);
router.delete('/:eventId', deleteEventById);
router.get('/:emailId', getEventsByEmailId);

export default router