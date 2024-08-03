
import express from 'express';

import { getUsers, getUserById, createUser, alterUser, deleteUser } from '../controllers/usersController';
const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id/change', alterUser);
router.delete('/:id', deleteUser);




export default router;

