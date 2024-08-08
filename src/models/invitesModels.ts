import db from '../database';

export const getAllInvitesQuery = async (id: number) => {
    try {
        const query = `
            SELECT * FROM invites
            WHERE invitee = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows;
    } catch (error) {
        console.error('Error fetching all invites:', error);
        throw error;
    }
}

export const sendInviteToQuery = async (inviter: number, invitee: number, groupId: number) => {
    const status = 'PENDING';
    try {
        const query = `
            INSERT INTO invites (inviter, invitee, groupId, status)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [inviter, invitee, groupId, status]);
        return result;
    } catch (error) {
        console.error('Error sending invite:', error);
        throw error;
    }
}

export const acceptInviteQuery = async (inviteId: number) => {
    try {
        const query = `
            UPDATE invites
            SET status = 'ACCEPTED'
            WHERE id = ?
        `;
        const [result] = await db.query(query, [inviteId]);
        return result;
    } catch (error) {
        console.error('Error accepting invite:', error);
        throw error;
    }
}

export const declineInviteQuery = async (inviteId: number) => {
    try {
        const query = `
            UPDATE invites
            SET status = 'DECLINED'
            WHERE id = ?
        `;
        const [result] = await db.query(query, [inviteId]);
        return result;
    } catch (error) {
        console.error('Error declining invite:', error);
        throw error;
    }
}

export const getInviteByIdQuery = async (id: number) => {
    try {
        const query = `
            SELECT * FROM invites
            WHERE id = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows;
    } catch (error) {
        console.error('Error fetching invite by ID:', error);
        throw error;
    }
}

export const getInvitesForGroupQuery = async (groupId: number) => {
    try {
        const query = `
            SELECT * FROM invites
            WHERE groupId = ?
        `;
        const [rows] = await db.query(query, [groupId]);
        return rows;
    } catch (error) {
        console.error('Error fetching invites for group:', error);
        throw error;
    }
}

export const getInvitesForUserQuery = async (id: number) => {
    try {
        const query = `
            SELECT * FROM invites
            WHERE invitee = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows;
    } catch (error) {
        console.error('Error fetching invites for user:', error);
        throw error;
    }
}

export const getInvitesSentByUserQuery = async (id: number) => {
    try {
        const query = `
            SELECT * FROM invites
            WHERE inviter = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows;
    } catch (error) {
        console.error('Error fetching invites sent by user:', error);
        throw error;
    }
}

export const getInvitesByStatusQuery = async (status: string) => {
    try {
        const query = `
            SELECT * FROM invites
            WHERE status = ?
        `;
        const [rows] = await db.query(query, [status]);
        return rows;
    } catch (error) {
        console.error('Error fetching invites by status:', error);
        throw error;
    }
}

