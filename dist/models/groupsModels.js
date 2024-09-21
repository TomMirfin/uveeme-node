"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAdminQuery = exports.makeAdminQuery = exports.addUserToGroupQuery = exports.deleteGroupQuery = exports.alterGroupQuery = exports.createGroupQuery = exports.getGroupByIdQuery = exports.getAllGroupsWithUserQuery = exports.getAllGroupsQuery = void 0;
const database_1 = __importDefault(require("../database"));
const uuid_1 = require("uuid"); // Import the UUID generator
const getAllGroupsQuery = async () => {
    try {
        const query = `
            SELECT * FROM \`groups\`;
        `;
        const [result] = await database_1.default.query(query);
        return result;
    }
    catch (error) {
        console.error('Error getting groups:', error);
        throw error;
    }
};
exports.getAllGroupsQuery = getAllGroupsQuery;
const getAllGroupsWithUserQuery = async (id) => {
    try {
        const query = `
            SELECT * FROM \`groups\`
            JOIN users
            ON groups.id = users.associatedGroupsId
        `;
        const [result] = await database_1.default.query(query);
        console.log(result);
        return result;
    }
    catch (error) {
        console.error('Error getting groups:', error);
        throw error;
    }
};
exports.getAllGroupsWithUserQuery = getAllGroupsWithUserQuery;
const getGroupByIdQuery = async (id) => {
    try {
        const query = `
            SELECT * FROM \`groups\`
            WHERE id = ?
        `;
        const [result] = await database_1.default.query(query, [id]);
        return result;
    }
    catch (error) {
        console.error('Error getting group:', error);
        throw error;
    }
};
exports.getGroupByIdQuery = getGroupByIdQuery;
const createGroupQuery = async (name, description = '', membersNames = [], memberTypes = [], membersIds = [], scoreByMember = {}, // JSON object for scores
lastEvent = null, nextEvent = null, groupImage = '', totalScore = 0, admin = []) => {
    const id = (0, uuid_1.v4)();
    try {
        const query = `
            INSERT INTO \`groups\` (
                id, name, description, membersNames, memberTypes, membersIds,
                scoreByMember, lastEvent, nextEvent, groupImage, totalScore, admin
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        const [result] = await database_1.default.query(query, values);
        return result;
    }
    catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};
exports.createGroupQuery = createGroupQuery;
const alterGroupQuery = async (id, name, description, groupImage) => {
    let query;
    let values;
    if (!name) {
        query = `UPDATE \`groups\` SET description = ?, groupImage = ? WHERE id = ?`;
        values = [description, groupImage, id];
    }
    else if (!description) {
        query = `UPDATE \`groups\` SET name = ?, groupImage = ? WHERE id = ?`;
        values = [name, groupImage, id];
    }
    else if (!groupImage) {
        query = `UPDATE \`groups\` SET name = ?, description = ? WHERE id = ?`;
        values = [name, description, id];
    }
    else {
        query = `UPDATE \`groups\` SET name = ?, description = ?, groupImage = ? WHERE id = ?`;
        values = [name, description, groupImage, id];
    }
    try {
        const [result] = await database_1.default.query(query, values);
        return result;
    }
    catch (error) {
        console.error('Error updating group:', error);
        throw error;
    }
};
exports.alterGroupQuery = alterGroupQuery;
const deleteGroupQuery = async (id) => {
    try {
        const query = `
            DELETE FROM \`groups\`
            WHERE id = ?
        `;
        const [result] = await database_1.default.query(query, [id]);
    }
    catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }
};
exports.deleteGroupQuery = deleteGroupQuery;
const addUserToGroupQuery = async (groupId, userId, name) => {
    const splitName = name.split(' ');
    try {
        const query = `
            INSERT INTO groups_users (groupId, userId, name)
            VALUES (?, ?, ?)
        `;
        const values = [groupId, userId, splitName[0]];
        const [result] = await database_1.default.query(query, values);
        return result;
    }
    catch (error) {
        console.error('Error adding user to group:', error);
        throw error;
    }
};
exports.addUserToGroupQuery = addUserToGroupQuery;
const updateGroupScore = async (groupId, userId, score) => {
};
const makeAdminQuery = async (groupId, userId, userName) => {
    try {
        // Check if the admin data exists for the group
        const checkQuery = `
            SELECT admin 
            FROM \`groups\`
            WHERE id = ?;
        `;
        const [result] = await database_1.default.query(checkQuery, [groupId]);
        let adminData = result[0]?.admin ? JSON.parse(result[0].admin) : [];
        adminData.push({ username: userName, userId, groupId });
        const updateQuery = `
            UPDATE \`groups\`
            SET admin = ?
            WHERE id = ?;
        `;
        await database_1.default.query(updateQuery, [JSON.stringify(adminData), groupId]);
        console.log('Admin updated successfully.');
    }
    catch (error) {
        console.error('Error making user admin:', error);
        throw error;
    }
};
exports.makeAdminQuery = makeAdminQuery;
const removeAdminQuery = async (groupId, userId) => {
    try {
        const checkQuery = `
            SELECT admin 
            FROM \`groups\`
            WHERE id = ?;
        `;
        const [rows, _] = await database_1.default.query(checkQuery, [groupId]);
        if (rows.length === 0) {
            throw new Error(`Group with ID ${groupId} not found.`);
        }
        const groupRow = rows[0];
        const adminData = groupRow.admin ? JSON.parse(groupRow.admin) : [];
        const updatedAdminData = adminData.filter(admin => admin.userId !== userId);
        const updateQuery = `
            UPDATE \`groups\`
            SET admin = ?
            WHERE id = ?;
        `;
        await database_1.default.query(updateQuery, [JSON.stringify(updatedAdminData), groupId]);
        console.log('Admin removed successfully.');
    }
    catch (error) {
        console.error('Error removing user admin:', error);
        throw error;
    }
};
exports.removeAdminQuery = removeAdminQuery;
