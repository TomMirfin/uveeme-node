
import express from 'express';

import { getUsers, getUserById, createUser, alterUser, deleteUser, loginUser } from '../controllers/usersController';
const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/:id/change', alterUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);




export default router;

