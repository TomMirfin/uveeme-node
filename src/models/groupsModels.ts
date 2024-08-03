import db from '../database';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID generator

export const getAllGroupsQuery = async () => {
    try {
        const query = `
            SELECT * FROM \`groups\`;
        `;
        const [result] = await db.query(query);
        return result;
    } catch (error) {
        console.error('Error getting groups:', error);
        throw error;
    }
}

export const getAllGroupsWithUserQuery = async (id: string) => {
    try {
        const query = `
            SELECT * FROM \`groups\`
            JOIN users
            ON groups.id = users.associatedGroupsId
        `;
        const [result] = await db.query(query);
        return result;
    } catch (error) {
        console.error('Error getting groups:', error);
        throw error;
    }
}

export const getGroupByIdQuery = async (id: string) => {
    try {
        const query = `
            SELECT * FROM \`groups\`
            WHERE id = ?
        `;
        const [result] = await db.query(query, [id]);
        return result;
    } catch (error) {
        console.error('Error getting group:', error);
        throw error;
    }
}


export const createGroupQuery = async (
    name: string,
    description: string = '',
    membersNames: string[] = [],
    memberTypes: string[] = [],
    membersIds: number[] = [],
    scoreByMember: Record<string, number> = {},  // JSON object for scores
    lastEvent: Date | null = null,
    nextEvent: Date | null = null,
    groupImage: string = 'http://example.com/default-image.jpg',
    totalScore: number = 0
) => {
    const id = uuidv4();
    try {
        const query = `
            INSERT INTO \`groups\` (
                id, name, description, membersNames, memberTypes, membersIds,
                scoreByMember, lastEvent, nextEvent, groupImage, totalScore
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            id,
            name,
            description || '', // Default to empty string if not provided
            JSON.stringify(membersNames), // Always default to empty array
            JSON.stringify(memberTypes),  // Always default to empty array
            JSON.stringify(membersIds),   // Always default to empty array
            JSON.stringify(scoreByMember), // Always default to empty object
            lastEvent ? lastEvent : '1970-01-01', // Default date if not provided
            nextEvent ? nextEvent : '1970-01-01', // Default date if not provided
            groupImage,
            totalScore
        ];
        const [result] = await db.query(query, values);
        return result;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};




export const alterGroupQuery = async (id: string, name: string, groupImage: string) => {
    try {
        const query = `
            UPDATE groups
            SET name = ?,
                description = ?,
                updatedOn = ?,
                groupImage = ?
            WHERE id = ?
        `;
        const values = [name, id, groupImage];
        const [result] = await db.query(query, values);
        return result;
    } catch (error) {
        console.error('Error updating group:', error);
        throw error;
    }
}


export const deleteGroupQuery = async (id: number) => {
    try {
        const query = `
            DELETE FROM groups
            WHERE id = ?
        `;
        const [result] = await db.query(query, [id]);
    }
    catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }
}

export const addUserToGroupQuery = async (groupId: number, userId: string, name: string) => {
    const splitName = name.split(' ');
    try {
        const query = `
            INSERT INTO groups_users (groupId, userId, name)
            VALUES (?, ?, ?)
        `;
        const values = [groupId, userId, splitName[0]];
        const [result] = await db.query(query, values);
        return result;
    } catch (error) {
        console.error('Error adding user to group:', error);
        throw error;
    }
}

const updateGroupScore = async (groupId: number, userId: string, score: number) => {

}

