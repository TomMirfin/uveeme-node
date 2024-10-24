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
        console.error("Error fetching invite by ID:", error);
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
        console.error("Error fetching invites for group:", error);
        throw error;
    }
};
exports.getEventsForGroupQuery = getEventsForGroupQuery;
const createEventQuery = async (name, description, fromGroup, location, startDate, endDate, attendees, scoreByMember, status = "inactive") => {
    const id = (0, uuid_1.v4)();
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        throw new Error("Invalid start date");
    }
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
        throw new Error("Invalid end date");
    }
    const formattedStartDate = (0, moment_1.default)(startDate).format("YYYY-MM-DD");
    const formattedEndDate = (0, moment_1.default)(endDate).format("YYYY-MM-DD");
    try {
        const groupQuery = `
            SELECT membersIds FROM \`groups\`
            WHERE id = ?
        `;
        const [groupRows] = await database_1.default.query(groupQuery, [fromGroup]);
        if (!Array.isArray(groupRows) || groupRows.length === 0) {
            throw new Error("Group not found");
        }
        const groupMemberIds = groupRows[0].membersIds || [];
        const allAttendees = [...new Set([...groupMemberIds, ...attendees])];
        const eventQuery = `
            INSERT INTO events (id, name, description, fromGroup, startDate, endDate, location, attendees, scoreByMember, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const eventValues = [
            id,
            name,
            description,
            fromGroup,
            formattedStartDate,
            formattedEndDate,
            location,
            JSON.stringify(allAttendees),
            JSON.stringify(scoreByMember),
            status,
        ];
        await database_1.default.query(eventQuery, eventValues);
        for (const { memberId, score } of scoreByMember) {
            await database_1.default.query(`
                INSERT INTO scorebyevent (eventId, memberId, score)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE score = VALUES(score);
            `, [id, memberId, score]);
        }
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
        console.error("Error creating event:", error);
        throw error;
    }
};
exports.createEventQuery = createEventQuery;
const alterEventQuery = async (id, name, description, startDate, endDate, location, attendeesToRemove = [], scoreByMember) => {
    let fieldsToUpdate = [];
    let values = [];
    let currentAttendees = [];
    if (attendeesToRemove.length > 0) {
        const [rows] = await database_1.default.query(`SELECT attendees FROM events WHERE id = ?`, [id]);
        currentAttendees = JSON.parse(rows[0]?.attendees || "[]");
        currentAttendees = currentAttendees.filter((userId) => !attendeesToRemove.includes(userId));
        values.push(JSON.stringify(currentAttendees));
        fieldsToUpdate.push(`attendees = ?`);
    }
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
    if (scoreByMember && Array.isArray(scoreByMember)) {
        const [currentScoresRows] = await database_1.default.query(`SELECT scoreByMember FROM events WHERE id = ?`, [id]);
        let currentScores = [];
        if (currentScoresRows.length > 0) {
            const scoreByMemberValue = currentScoresRows[0]?.scoreByMember;
            if (typeof scoreByMemberValue === "string") {
                currentScores = JSON.parse(scoreByMemberValue);
            }
            else if (typeof scoreByMemberValue === "object") {
                currentScores = scoreByMemberValue;
            }
        }
        scoreByMember.forEach(({ memberId, score }) => {
            const existingScoreIndex = currentScores.findIndex((s) => s.memberId === memberId);
            if (existingScoreIndex >= 0) {
                currentScores[existingScoreIndex].score += score;
                if (currentScores[existingScoreIndex].score < 0) {
                    currentScores[existingScoreIndex].score = 0;
                }
            }
            else {
                currentScores.push({ memberId, score });
            }
        });
        fieldsToUpdate.push(`scoreByMember = ?`);
        values.push(JSON.stringify(currentScores));
    }
    if (fieldsToUpdate.length === 0) {
        throw new Error("No fields to update");
    }
    const query = `UPDATE events SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    values.push(id);
    try {
        const [result] = await database_1.default.query(query, values);
        return result;
    }
    catch (error) {
        console.error("Error updating event:", error);
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
        console.error("Error deleting event:", error);
        throw error;
    }
};
exports.deleteEventQuery = deleteEventQuery;
