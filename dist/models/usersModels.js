"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserQuery = exports.alterUserQuery = exports.createUserQuery = exports.getUserByIdQuery = exports.getAllUsersQuery = void 0;
const database_1 = __importDefault(require("../database"));
const uuid_1 = require("uuid");
const getAllUsersQuery = async () => {
    try {
        const [rows, fields] = await database_1.default.query('SELECT * FROM users');
        console.log(rows);
        return rows;
    }
    catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};
exports.getAllUsersQuery = getAllUsersQuery;
// Get user by ID
const getUserByIdQuery = async (id) => {
    try {
        const [rows, fields] = await database_1.default.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows;
    }
    catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
    }
};
exports.getUserByIdQuery = getUserByIdQuery;
// Create a new user
const createUserQuery = async (name, email, profilePictureUrl, dob, phoneNumber, updatedOn, associatedGroupNames, associatedGroupsId) => {
    const id = (0, uuid_1.v4)();
    try {
        const [result] = await database_1.default.query('INSERT INTO users (id, name, email, profilePictureUrl, dob, phoneNumber, updatedOn, associatedGroupNames, associatedGroupsId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, name, email, profilePictureUrl, dob, phoneNumber, updatedOn, JSON.stringify(associatedGroupNames), JSON.stringify(associatedGroupsId)]);
        return result;
    }
    catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};
exports.createUserQuery = createUserQuery;
// Update an existing user
const alterUserQuery = async (id, // id should be the first argument since it's required
fieldsToUpdate) => {
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
        const [result] = await database_1.default.query(query, values);
        return result;
    }
    catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};
exports.alterUserQuery = alterUserQuery;
// Delete a user
const deleteUserQuery = async (userId) => {
    try {
        // First, delete all related group invites that reference the user
        await database_1.default.query('DELETE FROM groupinvites WHERE invitedBy = ?', [userId]);
        // Now delete the user from the users table
        const [result] = await database_1.default.query('DELETE FROM users WHERE id = ?', [userId]);
        return result;
    }
    catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error;
    }
};
exports.deleteUserQuery = deleteUserQuery;
