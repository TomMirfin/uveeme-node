import db from '../database';
import { v4 as uuidv4 } from 'uuid';
import Response from 'express';
export const getAllInvitesQuery = async (id: number) => {
    try {
        const query = `
            SELECT * FROM groupinvites
            WHERE invitee = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows;
    } catch (error) {
        console.error('Error fetching all invites:', error);
        throw error;
    }
}

export const sendInviteToQuery = async (id: string, invitedBy: string, invitee: string, invitedTo: string) => {
    const status = 'PENDING';
    const notificationSent = 1


    const query = `
        INSERT INTO groupinvites (id, invitedBy, invitee, invitedTo, status, notificationSent)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await db.query(query, [id, invitedBy, invitee, invitedTo, status, notificationSent]);
        return result;
    } catch (error) {
        console.error('Error sending invite:', error);
        throw error;
    }
};



export const acceptInviteQuery = async (inviteId: string) => {
    try {

        await db.query('START TRANSACTION');


        const updateQuery = `
            UPDATE groupinvites 
            SET Status = 'ACCEPTED' 
            WHERE ID = ?;
        `;
        await db.query(updateQuery, [inviteId]);


        const callProcedureQuery = `
            CALL CleanupInvitation(?);
        `;
        await db.query(callProcedureQuery, [inviteId]);


        await db.query('COMMIT');

        console.log('Invitation accepted and cleanup completed.');
    } catch (error) {

        await db.query('ROLLBACK');
        console.error('Error accepting invite:', error);
        throw error;
    }
}


export const declineInviteQuery = async (inviteId: string) => {
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

        const [updateResult]: any = await db.query(updateQuery, [inviteId]);


        if (updateResult.affectedRows > 0) {
            await db.query(deleteQuery, [inviteId]);
        }

        return updateResult;
    } catch (error) {
        console.error('Error rejecting invite:', error);
        throw error;
    }
};

export const getInviteByIdQuery = async (id: number) => {
    try {
        const query = `
            SELECT * FROM groupinvites
            WHERE id = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows;
    } catch (error) {
        console.error('Error fetching invite by ID:', error);
        throw error;
    }
}

export const getInvitesForGroupQuery = async (groupId: string) => {
    try {
        const query = `
            SELECT * FROM groupinvites
            WHERE invitedTo = ?
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
            SELECT * FROM groupinvites
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
            SELECT * FROM groupinvites
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
            SELECT * FROM groupinvites
            WHERE status = ?
        `;
        const [rows] = await db.query(query, [status]);
        return rows;
    } catch (error) {
        console.error('Error fetching invites by status:', error);
        throw error;
    }
}

