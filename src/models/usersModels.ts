import db from '../database';
import { v4 as uuidv4 } from 'uuid';

export const getAllUsersQuery = async () => {
    try {
        const [rows, fields] = await db.query('SELECT * FROM users');
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
}

// Get user by ID
export const getUserByIdQuery = async (id: number) => {
    try {
        const [rows, fields] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
    }
}

// Create a new user

export const createUserQuery = async (
    name: string,
    email: string,
    profilePictureUrl: string,
    dob: string,
    phoneNumber: string,
    updatedOn: string,
    associatedGroupNames: string[],
    associatedGroupsId: number[]
) => {
    const id = uuidv4();
    try {
        const [result] = await db.query(
            'INSERT INTO users (id, name, email, profilePictureUrl, dob, phoneNumber, updatedOn, associatedGroupNames, associatedGroupsId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, email, profilePictureUrl, dob, phoneNumber, updatedOn, JSON.stringify(associatedGroupNames), JSON.stringify(associatedGroupsId)]
        );
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}
// Update an existing user
export const alterUserQuery = async (
    name: string,
    email: string,
    profilePictureUrl: string,
    dob: string,
    createdOn: string,
    phoneNumber: string,
    id: string,
    associatedGroupNames: string[],
    associatedGroupId: number[]
) => {
    const updatedOn = new Date().toISOString().split('T')[0];
    try {
        const query = `
            UPDATE users
            SET name = ?,
                email = ?,
                profilePictureUrl = ?,
                dob = ?,
                createdOn = ?,
                phoneNumber = ?,
                updatedOn = ?,
                associatedGroupNames = ?,
                associatedGroupsId = ?
            WHERE id = ?
        `;
        const values = [
            id,
            name,
            email,
            profilePictureUrl,
            dob,
            createdOn,
            phoneNumber,
            updatedOn,
            JSON.stringify(associatedGroupNames),
            JSON.stringify(associatedGroupId),
        ];

        const [result] = await db.query(query, values);
        return result;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};


// Delete a user
export const deleteUserQuery = async (id: number) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result;
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
    }
}
