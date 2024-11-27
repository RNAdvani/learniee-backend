import express from 'express';
import { registerUser,loginUser,logoutUser, searchUser, getUserById, getMe } from '../controllers/user.controller';
import auth from '../middleware/auth.middleware';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser)
router.get('/search', auth,searchUser)
router.get("/userInfo/:userId",getUserById)
router.get("/me",auth,getMe)

export { router as userRoutes };