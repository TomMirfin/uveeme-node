import db from '../database';
import { v4 as uuidv4 } from 'uuid';

export const getEventByIdQuery = async (id: number) => {
    try {
        const query = `
            SELECT * FROM events
            WHERE id = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows;
    } catch (error) {
        console.error('Error fetching invite by ID:', error);
        throw error;
    }
}

export const getEventsForGroupQuery = async (groupId: number) => {
    try {
        const query = `
            SELECT * FROM events
            WHERE fromGroup = ?
        `;
        const [rows] = await db.query(query, [groupId]);
        return rows;
    } catch (error) {
        console.error('Error fetching invites for group:', error);
        throw error;
    }
}



export const createEventQuery = async (
    name: string,
    description: string,
    groupId: string,
    location: string,
    startDate: Date,
    endDate: Date,
    attendees: string[],
    scoreByMember: { memberId: string, score: number }[],
) => {
    const id = uuidv4();

    // Format dates to YYYY-MM-DD
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    const query = `
        INSERT INTO events (id, name, description, fromGroup, startDate, endDate, location, attendees, scoreByMember)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        id,
        name,
        description,
        groupId,
        formattedStartDate,
        formattedEndDate,
        location,
        JSON.stringify(attendees),
        JSON.stringify(scoreByMember)
    ];

    try {
        // Insert the event
        await db.query(query, values);

        // Insert default scores into scorebyevent table
        for (const { memberId, score } of scoreByMember) {
            await db.query(`
                INSERT INTO scorebyevent (eventId, memberId, score)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE score = VALUES(score);
            `, [id, memberId, score]);
        }

        // Update the scoreByMember field in the events table
        await db.query(`
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
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

export const alterEventQuery = async (
    id: number,
    name: string,
    description: string,
    date: Date,
    location: string,
    attendees: string[],
) => {
    const query = `
        UPDATE events
        SET id=?, name = ?, description = ?, date = ?, location = ?, attendees = ? 
        WHERE id = ?
    `;
    const values = [id, name, description, date, location, attendees];

    try {
        const [result] = await db.query(query, values);
        return result;
    } catch (error) {
        console.error('Error altering event:', error);
        throw error;
    }
};


export const deleteEventQuery = async (id: number) => {
    const query = `
        DELETE FROM events
        WHERE id = ?
    `;

    try {
        const [result] = await db.query(query, [id]);
        return result;
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};