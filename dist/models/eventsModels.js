"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventQuery = exports.alterEventQuery = exports.createEventQuery = exports.getEventsForGroupQuery = exports.getEventByIdQuery = void 0;
const database_1 = __importDefault(require("../database"));
const uuid_1 = require("uuid");
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
const createEventQuery = async (name, description, groupId, location, startDate, endDate, attendees, scoreByMember, status = 'inactive') => {
    const id = (0, uuid_1.v4)();
    // Validate that startDate and endDate are valid Date objects
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        throw new Error("Invalid start date");
    }
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
        throw new Error("Invalid end date");
    }
    // Format dates to YYYY-MM-DD
    const query = `
        INSERT INTO events (id, name, description, fromGroup, startDate, endDate, location, attendees, scoreByMember, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        id,
        name,
        description,
        groupId,
        startDate,
        endDate,
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
const alterEventQuery = async (id, name, description, date, location, attendees) => {
    const query = `
        UPDATE events
        SET id=?, name = ?, description = ?, date = ?, location = ?, attendees = ? 
        WHERE id = ?
    `;
    const values = [id, name, description, date, location, attendees];
    try {
        const [result] = await database_1.default.query(query, values);
        return result;
    }
    catch (error) {
        console.error('Error altering event:', error);
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
