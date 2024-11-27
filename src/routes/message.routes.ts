import { Router } from 'express';
import auth from '../middleware/auth.middleware';
import { sendMessage, getMessages, getRecentChats } from '../controllers/message.controller';

const router = Router();

router.post('/send', auth, sendMessage);
router.get('/m/:receiver', auth, getMessages);
router.get('/recent-chats', auth, getRecentChats);

export { router as messageRoutes };