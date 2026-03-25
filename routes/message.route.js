import express from 'express';
import {sendMessage, getMessages, deleteMessages} from '../controller/message.controller.js';
import Message from "../models/message.model.js";
const router = express.Router();

router.post('/send/:id', sendMessage);
router.get('/:user', getMessages);
router.delete('/:user', deleteMessages);

export default router;