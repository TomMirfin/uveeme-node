"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvitesByStatus = exports.getInvitesSentByUser = exports.getInvitesForGroup = exports.getInviteById = exports.declineInvite = exports.acceptInvite = exports.sendInviteTo = exports.getInvitesForUser = void 0;
const invitesModels_1 = require("../models/invitesModels");
/* DELIMITER $$

CREATE TRIGGER after_invite_accepted
AFTER UPDATE ON groupInvites
FOR EACH ROW
BEGIN
    IF NEW.Status = 'ACCEPTED' THEN
        IF FIND_IN_SET(NEW.invitee, (SELECT membersIds FROM `groups` WHERE id = NEW.invitedTo)) = 0 THEN
            UPDATE `groups`
            SET membersIds = TRIM(BOTH ',' FROM CONCAT_WS(',', membersIds, NEW.invitee))
            WHERE id = NEW.invitedTo;
        END IF;
    END IF;
END$$

DELIMITER ;
    */
const getInvitesForUser = (req, res) => {
    const { id } = req.params;
    console.log('getInvites');
    (0, invitesModels_1.getAllInvitesQuery)(id).then((rows) => { res.status(200).send(rows); });
};
exports.getInvitesForUser = getInvitesForUser;
const sendInviteTo = async (req, res) => {
    const { invitedBy, invitee, invitedTo } = req.body;
    console.log('sendInviteTo');
    try {
        const rows = await (0, invitesModels_1.sendInviteToQuery)(invitedBy, invitee, invitedTo);
        res.status(201).send({ success: true, rows });
    }
    catch (error) {
        console.error('Error sending invite:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.sendInviteTo = sendInviteTo;
const acceptInvite = async (req, res) => {
    const { inviteId } = req.params;
    console.log('acceptInvite');
    try {
        const rows = await (0, invitesModels_1.acceptInviteQuery)(inviteId);
        res.status(200).send(rows);
    }
    catch (error) {
        console.error('Error accepting invite:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.acceptInvite = acceptInvite;
const declineInvite = async (req, res) => {
    const { inviteId } = req.params;
    console.log('declineInvite');
    try {
        const rows = await (0, invitesModels_1.declineInviteQuery)(inviteId);
        res.status(200).send(rows);
    }
    catch (error) {
        console.error('Error declining invite:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.declineInvite = declineInvite;
const getInviteById = (req, res) => {
    const { id } = req.params;
    console.log('getInviteById');
    (0, invitesModels_1.getInviteByIdQuery)(id).then((rows) => { res.status(200).send(rows); });
};
exports.getInviteById = getInviteById;
const getInvitesForGroup = (req, res) => {
    const { id } = req.params;
    console.log('getInvitesForGroup');
    (0, invitesModels_1.getInvitesForGroupQuery)(id).then((rows) => { res.status(200).send(rows); });
};
exports.getInvitesForGroup = getInvitesForGroup;
const getInvitesSentByUser = (req, res) => {
    const { id } = req.params;
    console.log('getInvitesSentByUser');
    (0, invitesModels_1.getInvitesSentByUserQuery)(id).then((rows) => { res.status(200).send(rows); });
};
exports.getInvitesSentByUser = getInvitesSentByUser;
const getInvitesByStatus = (req, res) => {
    const { status } = req.params;
    console.log('getInvitesByStatus');
    (0, invitesModels_1.getInvitesByStatusQuery)(status).then((rows) => { res.status(200).send(rows); });
};
exports.getInvitesByStatus = getInvitesByStatus;
