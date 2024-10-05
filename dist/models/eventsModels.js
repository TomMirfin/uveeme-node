"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventQuery = exports.alterEvent = exports.alterEventQuery = exports.createEventQuery = exports.getEventsForGroupQuery = exports.getEventByIdQuery = void 0;
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
const createEventQuery = async (name, description, fromGroup, // groupId
location, startDate, endDate, attendees, // Attendees passed explicitly
scoreByMember, status = 'inactive') => {
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
    try {
        // Fetch the group member IDs from the groups table
        const groupQuery = `
            SELECT membersIds FROM \`groups\`
            WHERE id = ?
        `;
        const [groupRows] = await database_1.default.query(groupQuery, [fromGroup]);
        if (!Array.isArray(groupRows) || groupRows.length === 0) {
            throw new Error('Group not found');
        }
        // Assuming memberIds is a JSON array of member IDs
        const groupMemberIds = groupRows[0].membersIds || [];
        // Combine the group members and the explicitly passed attendees
        const allAttendees = [...new Set([...groupMemberIds, ...attendees])];
        // Insert the event
        const eventQuery = `
            INSERT INTO events (id, name, description, fromGroup, startDate, endDate, location, attendees, scoreByMember, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const eventValues = [
            id,
            name,
            description,
            fromGroup,
            formattedStartDate, // Use formatted dates here
            formattedEndDate,
            location,
            JSON.stringify(allAttendees), // Store all attendees as JSON
            JSON.stringify(scoreByMember),
            status
        ];
        await database_1.default.query(eventQuery, eventValues);
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
const alterEventQuery = async (id, name, description, startDate, endDate, location, attendeesToRemove = [], scoreByMember // New parameter for scores
) => {
    let fieldsToUpdate = [];
    let values = [];
    // Fetch current attendees if attendeesToRemove is provided
    let currentAttendees = [];
    if (attendeesToRemove.length > 0) {
        const [rows] = await database_1.default.query(`SELECT attendees FROM events WHERE id = ?`, [id]);
        currentAttendees = JSON.parse(rows[0]?.attendees || '[]');
        // Filter out the users to remove from attendees
        currentAttendees = currentAttendees.filter((userId) => !attendeesToRemove.includes(userId));
        values.push(JSON.stringify(currentAttendees)); // Will be used for attendees update
        fieldsToUpdate.push(`attendees = ?`);
    }
    // Construct fields to update based on provided values
    if (name) {
        fieldsToUpdate.push(`name = ?`);
        values.push(name);
    }
    if (description) {
        fieldsToUpdate.push(`description = ?`);
        values.push(description);
    }
    if (startDate) {
        fieldsToUpdate.push(`startDate = ?`);
        values.push(startDate);
    }
    if (endDate) {
        fieldsToUpdate.push(`endDate = ?`);
        values.push(endDate);
    }
    if (location) {
        fieldsToUpdate.push(`location = ?`);
        values.push(location);
    }
    // Include scoreByMember updates if provided
    if (scoreByMember && Array.isArray(scoreByMember)) {
        // Fetch current scores for this event
        const [currentScoresRows] = await database_1.default.query(`SELECT scoreByMember FROM events WHERE id = ?`, [id]);
        const currentScores = JSON.parse(currentScoresRows[0]?.scoreByMember || '[]');
        // Update scores based on provided data
        scoreByMember.forEach(({ memberId, score }) => {
            // Check if the member already has a score
            const existingScoreIndex = currentScores.findIndex((s) => s.memberId === memberId);
            if (existingScoreIndex >= 0) {
                // If the score exists, add or subtract the new score from the existing one
                currentScores[existingScoreIndex].score += score;
                // Ensure score doesn't go below zero
                if (currentScores[existingScoreIndex].score < 0) {
                    currentScores[existingScoreIndex].score = 0;
                }
            }
            else {
                // If the score does not exist, add a new entry
                currentScores.push({ memberId, score });
            }
        });
        // Push the updated scores to the fieldsToUpdate
        fieldsToUpdate.push(`scoreByMember = ?`);
        values.push(JSON.stringify(currentScores)); // Convert updated scores to JSON
    }
    // If no fields to update, throw an error
    if (fieldsToUpdate.length === 0) {
        throw new Error('No fields to update');
    }
    // Construct the final query
    const query = `UPDATE events SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    values.push(id); // Add id to the end of values array
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
const alterEvent = async (req, res, next) => {
    console.log('Request Body:', req.body);
    try {
        const { id, name, description, startDate, endDate, location, attendeesToRemove = [], // Rename to be clear
        scoreByMember, } = req.body;
        // Call the query function with optional parameters
        const rows = await (0, exports.alterEventQuery)(id, name, description, startDate, endDate, location, attendeesToRemove, scoreByMember);
        res.status(200).send({ message: 'Event updated successfully', rows });
    }
    catch (error) {
        console.error('Error updating event:', error);
        res.status(500).send({ error: 'Internal Server Error', details: error.message }); // More informative response
    }
};
exports.alterEvent = alterEvent;
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
