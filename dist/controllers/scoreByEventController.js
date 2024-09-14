"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScoresByEvent = void 0;
const scoreByEventModel_1 = require("../models/scoreByEventModel");
const updateScoresByEvent = async (req, res) => {
    const { id, eventId, memberId, score } = req.body;
    try {
        if (!eventId) {
            return res.status(400).send({ error: 'Event ID is required' });
        }
        const rows = await (0, scoreByEventModel_1.updateScoresByEventQuery)(id, eventId, memberId, score);
        res.status(200).send(rows);
    }
    catch (error) {
        console.error('Error updating scores by event:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.updateScoresByEvent = updateScoresByEvent;
