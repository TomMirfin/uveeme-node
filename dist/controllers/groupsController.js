"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmin = exports.makeAdmin = exports.deleteGroup = exports.alterGroup = exports.createGroup = exports.getGroupsContainingUser = exports.getGroupById = exports.getAllGroups = void 0;
const groupsModels_1 = require("../models/groupsModels");
const getAllGroups = async (req, res, next) => {
    console.log('getAllGroups');
    const rows = await (0, groupsModels_1.getAllGroupsQuery)();
    console.log(rows);
    return res.status(200).send(rows);
};
exports.getAllGroups = getAllGroups;
const getGroupById = (req, res, next) => {
    const { id } = req.params;
    (0, groupsModels_1.getGroupByIdQuery)(id).then((rows) => { res.status(200).send(rows); });
};
exports.getGroupById = getGroupById;
const getGroupsContainingUser = (req, res, next) => {
    const { id } = req.params;
    (0, groupsModels_1.getAllGroupsWithUserQuery)(id).then((rows) => { res.status(200).send(rows); });
};
exports.getGroupsContainingUser = getGroupsContainingUser;
// here I need to add the first user as admin
const createGroup = async (req, res, next) => {
    console.log('Request Body:', req.body);
    try {
        const { name, description, membersNames = [], memberTypes = [{}], membersIds = [], scoreByMember = {}, lastEvent = new Date(), nextEvent = new Date(), groupImage = '', totalScore = 0, admin = [], events = [] } = req.body;
        if (!name || !description) {
            return res.status(400).send({ error: 'Name and description are required' });
        }
        const { id, result } = await (0, groupsModels_1.createGroupQuery)(name, description, membersNames, memberTypes, membersIds, scoreByMember, lastEvent, nextEvent, groupImage, totalScore, admin, events);
        res.status(201).json({ success: true, groupId: id });
    }
    catch (error) {
        console.error('Error creating group:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.createGroup = createGroup;
const alterGroup = (req, res, next) => {
    const { id } = req.params;
    const { name, description, groupImage } = req.body;
    (0, groupsModels_1.alterGroupQuery)(id, name, description, groupImage).then((rows) => { res.status(200).send(rows); });
};
exports.alterGroup = alterGroup;
const deleteGroup = (req, res, next) => {
    const { id } = req.params;
    (0, groupsModels_1.deleteGroupQuery)(id).then((rows) => { res.status(204).send(`Group ${id} deleted`); });
};
exports.deleteGroup = deleteGroup;
const makeAdmin = (req, res, next) => {
    const { groupId, userId, userName } = req.body;
    (0, groupsModels_1.makeAdminQuery)(groupId, userId, userName).then((rows) => { res.status(200).send(rows); });
};
exports.makeAdmin = makeAdmin;
const deleteAdmin = (req, res, next) => {
    const { groupId, userId } = req.body;
    (0, groupsModels_1.removeAdminQuery)(groupId, userId).then((rows) => { res.status(200).send(rows); });
};
exports.deleteAdmin = deleteAdmin;
