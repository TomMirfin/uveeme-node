
import express from 'express';
import { registerUser } from '../controllers/registerUser';
import { loginUser } from '../controllers/usersController';

const router = express.Router();

router.post('/', registerUser);

router.post('/login', loginUser);

export default router;