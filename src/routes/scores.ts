import { updateScoresByEvent } from '../controllers/scoreByEventController';
import express from 'express';

const router = express.Router();

router.patch('/update-scores', updateScoresByEvent);

export default router;