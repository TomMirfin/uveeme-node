import db from '../database';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

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
    fromGroup: string, // groupId
    location: string,
    startDate: Date,
    endDate: Date,
    attendees: string[], // Attendees passed explicitly
    scoreByMember: { memberId: string, score: number }[],
    status: string = 'inactive'
) => {
    const id = uuidv4();

    // Validate that startDate and endDate are valid Date objects
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        throw new Error("Invalid start date");
    }
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
        throw new Error("Invalid end date");
    }

    // Format dates to YYYY-MM-DD
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

    try {
        // Fetch the group member IDs from the groups table
        const groupQuery = `
            SELECT memberIds FROM groups
            WHERE id = ?
        `;
        const [groupRows] = await db.query(groupQuery, [fromGroup]);

        if (groupRows.length === 0) {
            throw new Error('Group not found');
        }

        // Assuming memberIds is a JSON array of member IDs
        const groupMemberIds = groupRows[0].memberIds || [];

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

        await db.query(eventQuery, eventValues);

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
    id: string,
    name?: string,
    description?: string,
    startDate?: string,
    endDate?: string,
    location?: string,
    attendeesToRemove: string[] = []
) => {
    let query;
    let values: any[] = [];

    // Fetch current attendees if attendeesToRemove is provided
    let currentAttendees: string[] = [];
    if (attendeesToRemove.length > 0) {
        const [rows]: any = await db.query(`SELECT attendees FROM events WHERE id = ?`, [id]);
        currentAttendees = JSON.parse(rows[0]?.attendees || '[]');

        // Filter out the users to remove from attendees
        const updatedAttendees = currentAttendees.filter((userId: string) => !attendeesToRemove.includes(userId));

        values.push(JSON.stringify(updatedAttendees));
    }

    // Construct query based on the fields provided
    if (name && description && startDate && endDate && location) {
        query = `UPDATE events SET name = ?, description = ?, startDate = ?, endDate = ?, location = ?, attendees = ? WHERE id = ?`;
        values = [name, description, startDate, endDate, location, JSON.stringify(currentAttendees), id];
    } else if (!name) {
        query = `UPDATE events SET description = ?, startDate = ?, endDate = ?, location = ?, attendees = ? WHERE id = ?`;
        values = [description, startDate, endDate, location, JSON.stringify(currentAttendees), id];
    } else if (!description) {
        query = `UPDATE events SET name = ?, startDate = ?, endDate = ?, location = ?, attendees = ? WHERE id = ?`;
        values = [name, startDate, endDate, location, JSON.stringify(currentAttendees), id];
    } else if (!startDate) {
        query = `UPDATE events SET name = ?, description = ?, endDate = ?, location = ?, attendees = ? WHERE id = ?`;
        values = [name, description, endDate, location, JSON.stringify(currentAttendees), id];
    } else if (!endDate) {
        query = `UPDATE events SET name = ?, description = ?, startDate = ?, location = ?, attendees = ? WHERE id = ?`;
        values = [name, description, startDate, location, JSON.stringify(currentAttendees), id];
    } else if (!location) {
        query = `UPDATE events SET name = ?, description = ?, startDate = ?, endDate = ?, attendees = ? WHERE id = ?`;
        values = [name, description, startDate, endDate, JSON.stringify(currentAttendees), id];
    } else if (attendeesToRemove.length > 0) {
        query = `UPDATE events SET attendees = ? WHERE id = ?`;
        values = [JSON.stringify(currentAttendees), id];
    }

    try {
        const [result] = await db.query(query as string, values);
        return result;
    } catch (error) {
        console.error('Error updating event:', error);
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