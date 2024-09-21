import db from '../database';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID generator
import { QueryResult, FieldPacket, RowDataPacket } from 'mysql2/promise';
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
        console.log(result);
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
interface memberTypes {
    id: string
    name: string,
    type: string
}

export const createGroupQuery = async (
    name: string,
    description: string = '',
    membersNames: string[] = [],
    memberTypes: memberTypes[] = [],
    membersIds: number[] = [],
    scoreByMember: Record<string, number> = {},  // JSON object for scores
    lastEvent: Date | null = null,
    nextEvent: Date | null = null,
    groupImage: string = '',
    totalScore: number = 0,
    admin: string[] = []

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
            description || '',
            JSON.stringify(membersNames),
            JSON.stringify(memberTypes),
            JSON.stringify(membersIds),
            JSON.stringify(scoreByMember),
            lastEvent ? lastEvent : '1970-01-01',
            nextEvent ? nextEvent : '1970-01-01',
            groupImage,
            totalScore,
            JSON.stringify(admin)
        ];
        const [result] = await db.query(query, values);
        return result;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};




export const alterGroupQuery = async (
    id: string,
    name: string,
    description: string,
    groupImage: string
) => {
    let query;
    let values;

    if (!name) {
        query = `UPDATE \`groups\` SET description = ?, groupImage = ? WHERE id = ?`;
        values = [description, groupImage, id];
    } else if (!description) {
        query = `UPDATE \`groups\` SET name = ?, groupImage = ? WHERE id = ?`;
        values = [name, groupImage, id];
    } else if (!groupImage) {
        query = `UPDATE \`groups\` SET name = ?, description = ? WHERE id = ?`;
        values = [name, description, id];
    } else {
        query = `UPDATE \`groups\` SET name = ?, description = ?, groupImage = ? WHERE id = ?`;
        values = [name, description, groupImage, id];
    }

    try {
        const [result] = await db.query(query, values);
        return result;
    } catch (error) {
        console.error('Error updating group:', error);
        throw error;
    }
};



export const deleteGroupQuery = async (id: number) => {
    try {
        const query = `
            DELETE FROM \`groups\`
            WHERE id = ?
        `;
        const [result] = await db.query(query, [id])
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



export const makeAdminQuery = async (groupId: string, userId: string, userName: string) => {
    try {
        // Check if the admin data exists for the group
        const checkQuery = `
            SELECT admin 
            FROM \`groups\`
            WHERE id = ?;
        `;
        const [result]: any[] = await db.query(checkQuery, [groupId]);

        let adminData: any[] = result[0]?.admin ? JSON.parse(result[0].admin) : [];


        adminData.push({ username: userName, userId, groupId });

        const updateQuery = `
            UPDATE \`groups\`
            SET admin = ?
            WHERE id = ?;
        `;
        await db.query(updateQuery, [JSON.stringify(adminData), groupId]);

        console.log('Admin updated successfully.');
    } catch (error) {
        console.error('Error making user admin:', error);
        throw error;
    }
};



interface Admin {
    username: string;
    userId: string;
}


export const removeAdminQuery = async (groupId: string, userId: string) => {
    try {

        const checkQuery = `
            SELECT admin 
            FROM \`groups\`
            WHERE id = ?;
        `;


        const [rows, _]: [RowDataPacket[], FieldPacket[]] = await db.query(checkQuery, [groupId]);


        if (rows.length === 0) {
            throw new Error(`Group with ID ${groupId} not found.`);
        }


        const groupRow = rows[0];
        const adminData: Admin[] = groupRow.admin ? JSON.parse(groupRow.admin) : [];


        const updatedAdminData = adminData.filter(admin => admin.userId !== userId);


        const updateQuery = `
            UPDATE \`groups\`
            SET admin = ?
            WHERE id = ?;
        `;
        await db.query(updateQuery, [JSON.stringify(updatedAdminData), groupId]);

        console.log('Admin removed successfully.');
    } catch (error) {
        console.error('Error removing user admin:', error);
        throw error;
    }
};

