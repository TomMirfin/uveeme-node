"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvitesByStatusQuery = exports.getInvitesSentByUserQuery = exports.getInvitesForUserQuery = exports.getInvitesForGroupQuery = exports.getInviteByIdQuery = exports.declineInviteQuery = exports.acceptInviteQuery = exports.sendInviteToQuery = exports.getAllInvitesQuery = void 0;
const database_1 = __importDefault(require("../database"));
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
const sendInviteToQuery = async (id, invitedBy, invitee, invitedTo) => {
    const status = 'PENDING';
    const notificationSent = 1;
    const query = `
        INSERT INTO groupinvites (id, invitedBy, invitee, invitedTo, status, notificationSent)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    try {
        const [result] = await database_1.default.query(query, [id, invitedBy, invitee, invitedTo, status, notificationSent]);
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
        const updateQuery = `
            UPDATE groupinvites
            SET status = 'REJECTED'
            WHERE ID = ?
        `;
        const deleteQuery = `
            DELETE FROM groupinvites
            WHERE ID = ?
        `;
        const [updateResult] = await database_1.default.query(updateQuery, [inviteId]);
        if (updateResult.affectedRows > 0) {
            await database_1.default.query(deleteQuery, [inviteId]);
        }
        return updateResult;
    }
    catch (error) {
        console.error('Error rejecting invite:', error);
        throw error;
    }
};
exports.declineInviteQuery = declineInviteQuery;
const getInviteByIdQuery = async (id) => {
    try {
        const query = `
            SELECT * FROM groupinvites
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
            SELECT * FROM groupinvites
            WHERE invitedTo = ?
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
            SELECT * FROM groupinvites
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
            SELECT * FROM groupinvites
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
            SELECT * FROM groupinvites
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
