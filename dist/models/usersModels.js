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
const alterUserQuery = async (name, email, profilePictureUrl, dob, createdOn, phoneNumber, id, associatedGroupNames, associatedGroupId) => {
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
const deleteUserQuery = async (id) => {
    try {
        const [result] = await database_1.default.query('DELETE FROM users WHERE id = ?', [id]);
        return result;
    }
    catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
    }
};
exports.deleteUserQuery = deleteUserQuery;
