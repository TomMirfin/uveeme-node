import { getAllInvitesQuery, sendInviteToQuery, acceptInviteQuery, declineInviteQuery, getInviteByIdQuery, getInvitesForGroupQuery, getInvitesSentByUserQuery, getInvitesByStatusQuery } from "../models/invitesModels";

import { v4 as uuidv4 } from 'uuid';
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



export const getInvitesForUser = (req: any, res: any) => {
    const { id } = req.params;
    console.log('getInvites');
    getAllInvitesQuery(id).then((rows: any) => { res.status(200).send(rows) });
}


export const sendInviteTo = async (req: any, res: any) => {

    const { invitedBy, invitee, invitedTo } = req.body;
    console.log('sendInviteTo');
    try {
        const rows = await sendInviteToQuery(invitedBy, invitee, invitedTo);
        res.status(201).send({ success: true, rows });
    } catch (error) {
        console.error('Error sending invite:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export const acceptInvite = async (req: any, res: any) => {
    const { inviteId } = req.params;
    console.log('acceptInvite');
    try {
        const rows = await acceptInviteQuery(inviteId);
        res.status(200).send(rows);
    } catch (error) {
        console.error('Error accepting invite:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export const declineInvite = async (req: any, res: any) => {
    const { inviteId } = req.params;
    console.log('declineInvite');
    try {
        const rows = await declineInviteQuery(inviteId);
        res.status(200).send(rows);
    } catch (error) {
        console.error('Error declining invite:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export const getInviteById = (req: any, res: any) => {
    const { id } = req.params;
    console.log('getInviteById');
    getInviteByIdQuery(id).then((rows: any) => { res.status(200).send(rows) });
}


export const getInvitesForGroup = (req: any, res: any) => {
    const { id } = req.params;
    console.log('getInvitesForGroup');
    getInvitesForGroupQuery(id).then((rows: any) => { res.status(200).send(rows) });
}

export const getInvitesSentByUser = (req: any, res: any) => {
    const { id } = req.params;
    console.log('getInvitesSentByUser');
    getInvitesSentByUserQuery(id).then((rows: any) => { res.status(200).send(rows) });
}

export const getInvitesByStatus = (req: any, res: any) => {
    const { status } = req.params;
    console.log('getInvitesByStatus');
    getInvitesByStatusQuery(status).then((rows: any) => { res.status(200).send(rows) });
}

