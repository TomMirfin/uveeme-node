import express from 'express';
import { getInvitesForUser, sendInviteTo, acceptInvite, declineInvite, getInviteById, getInvitesForGroup } from '../controllers/invitesController';

const router = express.Router();

router.get('/users/:id', getInvitesForUser);
router.post('/', sendInviteTo);
router.patch('/:inviteId/accept', acceptInvite);
router.patch('/:inviteId/decline', declineInvite);
router.get('/:id', getInviteById);
router.get('/groups/:id', getInvitesForGroup);

export default router;