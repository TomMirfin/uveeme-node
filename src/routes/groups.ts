import { getAllGroups, getGroupById, getGroupsContainingUser, createGroup, alterGroup, deleteGroup } from "../controllers/groupsController";

import express from 'express';

const router = express.Router();

router.get('/', getAllGroups);
router.get('/:id', getGroupById);
router.get('/users/:id', getGroupsContainingUser);
router.post('/', createGroup);
router.patch('/:id', alterGroup);
router.delete('/:id', deleteGroup);

export default router;
