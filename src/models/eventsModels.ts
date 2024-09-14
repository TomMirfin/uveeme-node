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
    groupId: number,
    date: Date,
    location: string,
    startDate: Date,
    endDate: Date,
    attendees: string[],
    scoreByMember: { [key: string]: number },   // JSON object for scores
) => {
    const id = uuidv4();
    const query = `
        INSERT INTO events (id, name, description, fromGroup, startDate, endDate, location, attendees, scoreByMember)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [id, name, description, groupId, startDate, endDate, location, attendees, scoreByMember];

    try {
        const [result] = await db.query(query, values);
        return result;
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