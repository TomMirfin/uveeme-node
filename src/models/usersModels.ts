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
    id: string, // id should be the first argument since it's required
    fieldsToUpdate: {
        name?: string,
        email?: string,
        profilePictureUrl?: string,
        dob?: string,
        createdOn?: string,
        phoneNumber?: string,
        associatedGroupNames?: string[],
        associatedGroupId?: number[]
    }
) => {
    // Ensure the 'updatedOn' field is always updated when making any change
    const updatedOn = new Date().toISOString().split('T')[0];

    try {
        // Prepare an array to hold SQL set clauses and values
        let setClauses = [];
        let values = [];

        // Dynamically build the query based on the provided fields
        if (fieldsToUpdate.name) {
            setClauses.push('name = ?');
            values.push(fieldsToUpdate.name);
        }
        if (fieldsToUpdate.email) {
            setClauses.push('email = ?');
            values.push(fieldsToUpdate.email);
        }
        if (fieldsToUpdate.profilePictureUrl) {
            setClauses.push('profilePictureUrl = ?');
            values.push(fieldsToUpdate.profilePictureUrl);
        }
        if (fieldsToUpdate.dob) {
            setClauses.push('dob = ?');
            values.push(fieldsToUpdate.dob);
        }
        if (fieldsToUpdate.createdOn) {
            setClauses.push('createdOn = ?');
            values.push(fieldsToUpdate.createdOn);
        }
        if (fieldsToUpdate.phoneNumber) {
            setClauses.push('phoneNumber = ?');
            values.push(fieldsToUpdate.phoneNumber);
        }
        if (fieldsToUpdate.associatedGroupNames) {
            setClauses.push('associatedGroupNames = ?');
            values.push(JSON.stringify(fieldsToUpdate.associatedGroupNames));
        }
        if (fieldsToUpdate.associatedGroupId) {
            setClauses.push('associatedGroupsId = ?');
            values.push(JSON.stringify(fieldsToUpdate.associatedGroupId));
        }

        // Always update the 'updatedOn' field
        setClauses.push('updatedOn = ?');
        values.push(updatedOn);

        // Ensure we have fields to update
        if (setClauses.length === 0) {
            throw new Error('No fields provided to update.');
        }

        // Add the user ID to the query parameters (for the WHERE clause)
        values.push(id);

        // Build the final SQL query
        const query = `
            UPDATE users
            SET ${setClauses.join(', ')}
            WHERE id = ?
        `;

        // Execute the query with the dynamic values
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
