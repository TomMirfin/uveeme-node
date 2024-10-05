"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvitesByStatusQuery = exports.getInvitesSentByUserQuery = exports.getInvitesForUserQuery = exports.getInvitesForGroupQuery = exports.getInviteByIdQuery = exports.declineInviteQuery = exports.acceptInviteQuery = exports.sendInviteToQuery = exports.getAllInvitesQuery = void 0;
const database_1 = __importDefault(require("../database"));
const uuid_1 = require("uuid");
const getAllInvitesQuery = async (id) => {
    try {
        const query = `
            SELECT * FROM groupinvites
            WHERE invitee = ?
        `;
        const [rows] = await database_1.default.query(query, [id]);
        return rows;
    }
    catch (error) {
        console.error('Error fetching all invites:', error);
        throw error;
    }
};
exports.getAllInvitesQuery = getAllInvitesQuery;
const sendInviteToQuery = async (invitedBy, invitee, groupId) => {
    const status = 'PENDING';
    const notificationSent = 1;
    const id = (0, uuid_1.v4)();
    const query = `
        INSERT INTO groupinvites (id, invitedBy, invitee, invitedTo, status, notificationSent)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    try {
        const [result] = await database_1.default.query(query, [id, invitedBy, invitee, groupId, status, notificationSent]);
        return result;
    }
    catch (error) {
        console.error('Error sending invite:', error);
        throw error;
    }
};
exports.sendInviteToQuery = sendInviteToQuery;
const acceptInviteQuery = async (inviteId) => {
    try {
        await database_1.default.query('START TRANSACTION');
        const updateQuery = `
            UPDATE groupinvites 
            SET Status = 'ACCEPTED' 
            WHERE ID = ?;
        `;
        await database_1.default.query(updateQuery, [inviteId]);
        const callProcedureQuery = `
            CALL CleanupInvitation(?);
        `;
        await database_1.default.query(callProcedureQuery, [inviteId]);
        await database_1.default.query('COMMIT');
        console.log('Invitation accepted and cleanup completed.');
    }
    catch (error) {
        await database_1.default.query('ROLLBACK');
        console.error('Error accepting invite:', error);
        throw error;
    }
};
exports.acceptInviteQuery = acceptInviteQuery;
const declineInviteQuery = async (inviteId) => {
    try {
        const query = `
            UPDATE invites
            SET status = 'DECLINED'
            WHERE id = ?
        `;
        const [result] = await database_1.default.query(query, [inviteId]);
        return result;
    }
    catch (error) {
        console.error('Error declining invite:', error);
        throw error;
    }
};
exports.declineInviteQuery = declineInviteQuery;
const getInviteByIdQuery = async (id) => {
    try {
        const query = `
            SELECT * FROM invites
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
exports.getInviteByIdQuery = getInviteByIdQuery;
const getInvitesForGroupQuery = async (groupId) => {
    try {
        const query = `
            SELECT * FROM invites
            WHERE groupId = ?
        `;
        const [rows] = await database_1.default.query(query, [groupId]);
        return rows;
    }
    catch (error) {
        console.error('Error fetching invites for group:', error);
        throw error;
    }
};
exports.getInvitesForGroupQuery = getInvitesForGroupQuery;
const getInvitesForUserQuery = async (id) => {
    try {
        const query = `
            SELECT * FROM invites
            WHERE invitee = ?
        `;
        const [rows] = await database_1.default.query(query, [id]);
        return rows;
    }
    catch (error) {
        console.error('Error fetching invites for user:', error);
        throw error;
    }
};
exports.getInvitesForUserQuery = getInvitesForUserQuery;
const getInvitesSentByUserQuery = async (id) => {
    try {
        const query = `
            SELECT * FROM invites
            WHERE inviter = ?
        `;
        const [rows] = await database_1.default.query(query, [id]);
        return rows;
    }
    catch (error) {
        console.error('Error fetching invites sent by user:', error);
        throw error;
    }
};
exports.getInvitesSentByUserQuery = getInvitesSentByUserQuery;
const getInvitesByStatusQuery = async (status) => {
    try {
        const query = `
            SELECT * FROM invites
            WHERE status = ?
        `;
        const [rows] = await database_1.default.query(query, [status]);
        return rows;
    }
    catch (error) {
        console.error('Error fetching invites by status:', error);
        throw error;
    }
};
exports.getInvitesByStatusQuery = getInvitesByStatusQuery;
