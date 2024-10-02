"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventQuery = exports.alterEventQuery = exports.createEventQuery = exports.getEventsForGroupQuery = exports.getEventByIdQuery = void 0;
const database_1 = __importDefault(require("../database"));
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
const getEventByIdQuery = async (id) => {
    try {
        const query = `
            SELECT * FROM events
            WHERE id = ?
        `;
        const [rows] = await database_1.default.query(query, [id]);
        return rows;
    }
    catch (error) {
        console.error('Error fetching invite by ID:', error);
        throw error;
    }
};
exports.getEventByIdQuery = getEventByIdQuery;
const getEventsForGroupQuery = async (groupId) => {
    try {
        const query = `
            SELECT * FROM events
            WHERE fromGroup = ?
        `;
        const [rows] = await database_1.default.query(query, [groupId]);
        return rows;
    }
    catch (error) {
        console.error('Error fetching invites for group:', error);
        throw error;
    }
};
exports.getEventsForGroupQuery = getEventsForGroupQuery;
const createEventQuery = async (name, description, fromGroup, location, startDate, endDate, attendees, scoreByMember, status = 'inactive') => {
    const id = (0, uuid_1.v4)();
    // Validate that startDate and endDate are valid Date objects
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        throw new Error("Invalid start date");
    }
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
        throw new Error("Invalid end date");
    }
    // Format dates to YYYY-MM-DD
    const formattedStartDate = (0, moment_1.default)(startDate).format('YYYY-MM-DD');
    const formattedEndDate = (0, moment_1.default)(endDate).format('YYYY-MM-DD');
    const query = `
        INSERT INTO events (id, name, description, fromGroup, startDate, endDate, location, attendees, scoreByMember, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        id,
        name,
        description,
        fromGroup,
        formattedStartDate, // Use formatted dates here
        formattedEndDate,
        location,
        JSON.stringify(attendees),
        JSON.stringify(scoreByMember),
        status
    ];
    try {
        // Insert the event
        await database_1.default.query(query, values);
        // Insert default scores into scorebyevent table
        for (const { memberId, score } of scoreByMember) {
            await database_1.default.query(`
                INSERT INTO scorebyevent (eventId, memberId, score)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE score = VALUES(score);
            `, [id, memberId, score]);
        }
        // Update the scoreByMember field in the events table
        await database_1.default.query(`
            UPDATE events
            SET scoreByMember = (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT('memberId', memberId, 'score', score)
                )
                FROM scorebyevent
                WHERE eventId = ?
            )
            WHERE id = ?;
        `, [id, id]);
        return { id };
    }
    catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};
exports.createEventQuery = createEventQuery;
const alterEventQuery = async (id, name, description, startDate, endDate, location, attendeesToRemove = []) => {
    let query;
    let values = [];
    // Fetch current attendees if attendeesToRemove is provided
    let currentAttendees = [];
    if (attendeesToRemove.length > 0) {
        const [rows] = await database_1.default.query(`SELECT attendees FROM events WHERE id = ?`, [id]);
        currentAttendees = JSON.parse(rows[0]?.attendees || '[]');
        // Filter out the users to remove from attendees
        const updatedAttendees = currentAttendees.filter((userId) => !attendeesToRemove.includes(userId));
        values.push(JSON.stringify(updatedAttendees));
    }
    // Construct query based on the fields provided
    if (name && description && startDate && endDate && location) {
        query = `UPDATE events SET name = ?, description = ?, startDate = ?, endDate = ?, location = ?, attendees = ? WHERE id = ?`;
        values = [name, description, startDate, endDate, location, JSON.stringify(currentAttendees), id];
    }
    else if (!name) {
        query = `UPDATE events SET description = ?, startDate = ?, endDate = ?, location = ?, attendees = ? WHERE id = ?`;
        values = [description, startDate, endDate, location, JSON.stringify(currentAttendees), id];
    }
    else if (!description) {
        query = `UPDATE events SET name = ?, startDate = ?, endDate = ?, location = ?, attendees = ? WHERE id = ?`;
        values = [name, startDate, endDate, location, JSON.stringify(currentAttendees), id];
    }
    else if (!startDate) {
        query = `UPDATE events SET name = ?, description = ?, endDate = ?, location = ?, attendees = ? WHERE id = ?`;
        values = [name, description, endDate, location, JSON.stringify(currentAttendees), id];
    }
    else if (!endDate) {
        query = `UPDATE events SET name = ?, description = ?, startDate = ?, location = ?, attendees = ? WHERE id = ?`;
        values = [name, description, startDate, location, JSON.stringify(currentAttendees), id];
    }
    else if (!location) {
        query = `UPDATE events SET name = ?, description = ?, startDate = ?, endDate = ?, attendees = ? WHERE id = ?`;
        values = [name, description, startDate, endDate, JSON.stringify(currentAttendees), id];
    }
    else if (attendeesToRemove.length > 0) {
        query = `UPDATE events SET attendees = ? WHERE id = ?`;
        values = [JSON.stringify(currentAttendees), id];
    }
    try {
        const [result] = await database_1.default.query(query, values);
        return result;
    }
    catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};
exports.alterEventQuery = alterEventQuery;
const deleteEventQuery = async (id) => {
    const query = `
        DELETE FROM events
        WHERE id = ?
    `;
    try {
        const [result] = await database_1.default.query(query, [id]);
        return result;
    }
    catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};
exports.deleteEventQuery = deleteEventQuery;
