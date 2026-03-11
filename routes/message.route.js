import express from 'express';
import {sendMessage, getMessages} from '../controller/message.controller.js';
import Message from "../models/message.model.js";
const router = express.Router();

router.post('/send/:id', sendMessage);
router.get('/:user', getMessages);

export default router;