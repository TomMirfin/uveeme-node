import { Request, Response } from 'express';
import { updateScoresByEventQuery } from '../models/scoreByEventModel';

export const updateScoresByEvent = async (req: Request, res: Response) => {

    const { id, eventId, memberId, score } = req.body;

    try {
        if (!eventId) {
            return res.status(400).send({ error: 'Event ID is required' });
        }
        const rows = await updateScoresByEventQuery(id, eventId, memberId, score);
        res.status(200).send(rows);
    } catch (error) {
        console.error('Error updating scores by event:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
