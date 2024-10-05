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
    fromGroup: string,
    location: string,
    startDate: Date,
    endDate: Date,
    attendees: string[],
    scoreByMember: { memberId: string, score: number }[] = [], // Optional
    status: string = 'inactive'
) => {
    const id = uuidv4();
    const scoreIds = []; // Array to store the IDs of scorebyevent entries

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

    const query = `
        INSERT INTO events (id, name, description, fromGroup, startDate, endDate, location, attendees, scoreByMember, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        id,
        name,
        description,
        fromGroup,
        formattedStartDate, // Use formatted dates here
        formattedEndDate,
        location,
        JSON.stringify(attendees),
        JSON.stringify(scoreByMember), // This can be an empty array if no scores are provided initially
        status
    ];

    try {
        // Insert the event
        await db.query(query, values);

        // Fetch all member IDs from the group to insert into scorebyevent table
        const membersQuery = `SELECT memberId FROM groupmembers WHERE groupId = ?`; // Adjust the table and column names as per your schema
        const [membersRows] = await db.query(membersQuery, [fromGroup]);
        const members = Array.isArray(membersRows) ? membersRows : [];

        // Create score entries for each member in scorebyevent table
        for (const member of members as any) {
            const scoreId = uuidv4(); // Generate a unique ID for each score entry
            const score = 0; // Set default score to 0 or any default value you prefer

            // Use INSERT ... ON DUPLICATE KEY UPDATE to ensure up-to-date scores
            await db.query(`
                INSERT INTO scorebyevent (id, eventId, memberId, score)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE score = VALUES(score);
            `, [scoreId, id, member.memberId, score]); // Assuming memberId is available in the returned member object

            scoreIds.push(scoreId); // Store the score ID
        }

        // Insert or update scores for the provided members
        for (const { memberId, score } of scoreByMember) {
            const scoreId = uuidv4(); // Generate a unique ID for the provided score

            // Use INSERT ... ON DUPLICATE KEY UPDATE to ensure up-to-date scores
            await db.query(`
                INSERT INTO scorebyevent (id, eventId, memberId, score)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE score = VALUES(score);
            `, [scoreId, id, memberId, score]);

            scoreIds.push(scoreId); // Store the score ID
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

        // Return the event ID and the score IDs
        return { eventId: id, scoreIds }; // Return both IDs
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