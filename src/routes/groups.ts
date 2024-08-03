import { getAllGroups, getGroupById, getGroupsContainingUser, createGroup, alterGroup, deleteGroup } from "../controllers/groupsController";

import express from 'express';

const router = express.Router();

router.get('/', getAllGroups);
router.get('/:id', getGroupById);
router.get('/:id', getGroupsContainingUser);
router.post('/', createGroup);
router.put('/:id/change', alterGroup);
router.delete('/:id', deleteGroup);

export default router;
