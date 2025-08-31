import { Router } from "express";
import { createList, getLists, getListById, updateListById, deleteListById, getListsByEmailId } from "../controllers/ListController.js";

const router = Router();

router.post('/', createList);
router.get('/', getLists);
router.get('/:listId', getListById);
router.put('/:listId', updateListById);
router.delete('/:listId', deleteListById);
router.get('/user/:emailId', getListsByEmailId);

export default router;
