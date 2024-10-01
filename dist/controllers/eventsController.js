"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.alterEvent = exports.createEvent = exports.getEventsForGroup = exports.getEventById = void 0;
const eventsModels_1 = require("../models/eventsModels");
const getEventById = (req, res, next) => {
    const { id } = req.params;
    (0, eventsModels_1.getEventByIdQuery)(id).then((rows) => { res.status(200).send(rows); });
};
exports.getEventById = getEventById;
const getEventsForGroup = (req, res, next) => {
    const { id } = req.params;
    (0, eventsModels_1.getEventsForGroupQuery)(id).then((rows) => { res.status(200).send(rows); });
};
exports.getEventsForGroup = getEventsForGroup;
const createEvent = async (req, res, next) => {
    console.log('Request Body:', req.body);
    try {
        const { name, description, groupId, location, attendees = [], scoreByMember = {}, startDate, endDate, status } = req.body;
        if (!name || !description) {
            return res.status(400).send({ error: 'Name and description are required' });
        }
        const rows = await (0, eventsModels_1.createEventQuery)(name, description, groupId, location, attendees, scoreByMember, startDate, endDate, status);
        res.status(201).json(rows);
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.createEvent = createEvent;
const alterEvent = async (req, res, next) => {
    console.log('Request Body:', req.body);
    try {
        const { id, name, description, date, location, attendees = [] } = req.body;
        if (!id) {
            return res.status(400).send({ error: 'Event ID is required' });
        }
        const rows = await (0, eventsModels_1.alterEventQuery)(id, name, description, date, location, attendees);
        res.status(200).send(rows);
    }
    catch (error) {
        console.error('Error updating event:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.alterEvent = alterEvent;
const deleteEvent = async (req, res, next) => {
    const { id } = req.params;
    try {
        const rows = await (0, eventsModels_1.deleteEventQuery)(id);
        res.status(200).send(rows);
    }
    catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.deleteEvent = deleteEvent;
