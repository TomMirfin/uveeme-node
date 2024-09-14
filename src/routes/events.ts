import express from 'express';
import { alterEvent, createEvent, deleteEvent, getEventById, getEventsForGroup } from '../controllers/eventsController';

const router = express.Router();

router.get('/groups/:id', getEventsForGroup);
router.get('/:id', getEventById);
router.post('/', createEvent);
router.patch('/:id', alterEvent);
router.delete('/:id', deleteEvent);

export default router;