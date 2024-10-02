"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.alterEvent = exports.createEvent = exports.getEventsForGroup = exports.getEventById = void 0;
const eventsModels_1 = require("../models/eventsModels");
const moment_1 = __importDefault(require("moment"));
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
        const { name, description, fromGroup, // Presumably the group ID this event is associated with
        location, attendees = [], scoreByMember = [], startDate, endDate, status = 'INACTIVE' // Default to INACTIVE if not provided
         } = req.body;
        // Validate required fields
        if (!name || !description) {
            return res.status(400).send({ error: 'Name and description are required' });
        }
        // Convert to Date objects using moment
        const momentStartDate = (0, moment_1.default)(startDate).toDate();
        const momentEndDate = (0, moment_1.default)(endDate).toDate();
        // Create event query
        const rows = await (0, eventsModels_1.createEventQuery)(name, description, fromGroup, location, momentStartDate, momentEndDate, attendees, scoreByMember, status);
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
        const { id, name, description, startDate, endDate, location, attendees = [] } = req.body;
        // Call the query function with optional parameters
        const rows = await (0, eventsModels_1.alterEventQuery)(id, name, description, startDate, endDate, location, attendees);
        res.status(200).send({ message: 'Event updated successfully', rows });
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
