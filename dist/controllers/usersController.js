"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.deleteUser = exports.alterUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const usersModels_1 = require("../models/usersModels");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const passport_1 = __importDefault(require("passport"));
const getUsers = async (req, res, next) => {
    console.log('getUsers');
    try {
        const rows = await (0, usersModels_1.getAllUsersQuery)();
        console.log(rows);
        const usersWithoutPasswords = rows.map(({ password, ...user }) => user);
        return res.status(200).send(usersWithoutPasswords);
    }
    catch (error) {
        console.error('Error retrieving users:', error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const rows = await (0, usersModels_1.getUserByIdQuery)(userId);
        const user = rows[0];
        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }
        // Exclude the password from the response
        const { password, ...userResponse } = user;
        res.status(200).send(userResponse);
    }
    catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res, next) => {
    const { name, email, profilePictureUrl, dob, phoneNumber, updatedOn, associatedGroupNames, associatedGroupId, password } = req.body;
    const id = (0, uuid_1.v4)();
    if (!name || !email || !password) {
        return res.status(400).send({ error: 'Name, email, and password are required.' });
    }
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await (0, usersModels_1.createUserQuery)(id, name, email, hashedPassword, profilePictureUrl, dob, phoneNumber, updatedOn, associatedGroupNames, associatedGroupId);
        res.status(201).send(user);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.createUser = createUser;
const alterUser = async (req, res, next) => {
    const { id } = req.params;
    const fieldsToUpdate = req.body;
    try {
        const result = await (0, usersModels_1.alterUserQuery)(id, fieldsToUpdate);
        res.status(200).json({ message: 'User updated successfully', result });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};
exports.alterUser = alterUser;
const deleteUser = (req, res, next) => {
    const { id } = req.params;
    (0, usersModels_1.deleteUserQuery)(id).then((rows) => { res.status(204).send(rows); });
};
exports.deleteUser = deleteUser;
const loginUser = (req, res, next) => {
    passport_1.default.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ error: 'Invalid credentials.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).send({ token });
    })(req, res, next);
};
exports.loginUser = loginUser;
