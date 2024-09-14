"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.alterUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const usersModels_1 = require("../models/usersModels");
const getUsers = async (req, res, next) => {
    console.log('getUsers');
    const rows = await (0, usersModels_1.getAllUsersQuery)();
    console.log(rows);
    return res.status(200).send(rows);
};
exports.getUsers = getUsers;
const getUserById = (req, res, next) => {
    const { id } = req.params;
    (0, usersModels_1.getUserByIdQuery)(id).then((rows) => { res.status(200).send(rows); });
};
exports.getUserById = getUserById;
const createUser = (req, res, next) => {
    const { name, email, profilePictureUrl, dob, phoneNumber, updatedOn, associatedGroupNames, associatedGroupId } = req.body;
    (0, usersModels_1.createUserQuery)(name, email, profilePictureUrl, dob, phoneNumber, updatedOn, associatedGroupNames, associatedGroupId).then((rows) => { res.status(201).send(rows); });
};
exports.createUser = createUser;
const alterUser = (req, res, next) => {
    const { id } = req.params;
    const { name, email, profilePictureUrl, dob, createdOn, phoneNumber, associatedGroupNames, associatedGroupId } = req.body;
    //update user
    (0, usersModels_1.alterUserQuery)(id, name, email, profilePictureUrl, dob, createdOn, phoneNumber, associatedGroupNames, associatedGroupId).then((rows) => { res.status(200).send(rows); });
};
exports.alterUser = alterUser;
const deleteUser = (req, res, next) => {
    const { id } = req.params;
    (0, usersModels_1.deleteUserQuery)(id).then((rows) => { res.status(204).send(rows); });
};
exports.deleteUser = deleteUser;
