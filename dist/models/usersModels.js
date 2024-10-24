"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserQuery = exports.alterUserQuery = exports.createUserQuery = exports.getUserByEmailQuery = exports.getUserByIdQuery = exports.getAllUsersQuery = void 0;
const database_1 = __importDefault(require("../database"));
const getAllUsersQuery = async () => {
    try {
        const [rows, fields] = await database_1.default.query("SELECT * FROM users");
        console.log(rows);
        return rows;
    }
    catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};
exports.getAllUsersQuery = getAllUsersQuery;
const getUserByIdQuery = async (id) => {
    try {
        const [rows, fields] = await database_1.default.query("SELECT * FROM users WHERE id = ?", [
            id,
        ]);
        return rows;
    }
    catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
    }
};
exports.getUserByIdQuery = getUserByIdQuery;
const getUserByEmailQuery = async (email) => {
    try {
        const [rows, fields] = await database_1.default.query("SELECT * FROM users WHERE email = ?", [email]);
        return rows;
    }
    catch (error) {
        console.error(`Error fetching user with email ${email}:`, error);
        throw error;
    }
};
exports.getUserByEmailQuery = getUserByEmailQuery;
const createUserQuery = async (id, hashedPassword, name, email, profilePictureUrl, dob, phoneNumber, updatedOn, associatedGroupNames, associatedGroupId) => {
    try {
        const createdOn = new Date().toISOString();
        const [result] = await database_1.default.query(`INSERT INTO users (id, password, name, email, profilePictureUrl, dob, phoneNumber, createdOn, updatedOn, associatedGroupNames, associatedGroupsId) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            id,
            hashedPassword,
            name,
            email,
            profilePictureUrl,
            dob,
            phoneNumber,
            createdOn,
            updatedOn,
            JSON.stringify(associatedGroupNames),
            JSON.stringify(associatedGroupId),
        ]);
        return result;
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};
exports.createUserQuery = createUserQuery;
const alterUserQuery = async (id, fieldsToUpdate) => {
    const updatedOn = new Date().toISOString().split("T")[0];
    try {
        let setClauses = [];
        let values = [];
        if (fieldsToUpdate.name) {
            setClauses.push("name = ?");
            values.push(fieldsToUpdate.name);
        }
        if (fieldsToUpdate.email) {
            setClauses.push("email = ?");
            values.push(fieldsToUpdate.email);
        }
        if (fieldsToUpdate.profilePictureUrl) {
            setClauses.push("profilePictureUrl = ?");
            values.push(fieldsToUpdate.profilePictureUrl);
        }
        if (fieldsToUpdate.dob) {
            setClauses.push("dob = ?");
            values.push(fieldsToUpdate.dob);
        }
        if (fieldsToUpdate.createdOn) {
            setClauses.push("createdOn = ?");
            values.push(fieldsToUpdate.createdOn);
        }
        if (fieldsToUpdate.phoneNumber) {
            setClauses.push("phoneNumber = ?");
            values.push(fieldsToUpdate.phoneNumber);
        }
        if (fieldsToUpdate.associatedGroupNames) {
            setClauses.push("associatedGroupNames = ?");
            values.push(JSON.stringify(fieldsToUpdate.associatedGroupNames));
        }
        if (fieldsToUpdate.associatedGroupId) {
            setClauses.push("associatedGroupsId = ?");
            values.push(JSON.stringify(fieldsToUpdate.associatedGroupId));
        }
        setClauses.push("updatedOn = ?");
        values.push(updatedOn);
        if (setClauses.length === 0) {
            throw new Error("No fields provided to update.");
        }
        values.push(id);
        const query = `
            UPDATE users
            SET ${setClauses.join(", ")}
            WHERE id = ?
        `;
        const [result] = await database_1.default.query(query, values);
        return result;
    }
    catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};
exports.alterUserQuery = alterUserQuery;
const deleteUserQuery = async (userId) => {
    try {
        await database_1.default.query("DELETE FROM groupinvites WHERE invitedBy = ?", [userId]);
        const [result] = await database_1.default.query("DELETE FROM users WHERE id = ?", [userId]);
        return result;
    }
    catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error;
    }
};
exports.deleteUserQuery = deleteUserQuery;
