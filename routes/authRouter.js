import express from 'express';
import authController from '../controllers/authController.js'
import auth  from '../middleware/auth.js';
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.patch('/updateUser',auth, authController.updateUser);

export default router;
