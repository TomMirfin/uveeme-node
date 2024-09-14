import { getAllGroupsQuery, getAllGroupsWithUserQuery, getGroupByIdQuery, createGroupQuery, alterGroupQuery, deleteGroupQuery, addUserToGroupQuery, makeAdminQuery, removeAdminQuery } from '../models/groupsModels';

export const getAllGroups = async (req: any, res: any, next: any) => {
    console.log('getAllGroups');
    const rows = await getAllGroupsQuery();
    console.log(rows);
    return res.status(200).send(rows);
}

export const getGroupById = (req: any, res: any, next: any) => {
    const { id } = req.params;
    getGroupByIdQuery(id).then((rows: any) => { res.status(200).send(rows) });
}

export const getGroupsContainingUser = (req: any, res: any, next: any) => {
    const { id } = req.params;
    getAllGroupsWithUserQuery(id).then((rows: any) => { res.status(200).send(rows) });

}


export const createGroup = async (req: any, res: any, next: any) => {
    console.log('Request Body:', req.body);

    try {
        const {
            name,
            description,
            membersNames = [],
            memberTypes = [{}],
            membersIds = [],
            scoreByMember = {},
            lastEvent = new Date(),
            nextEvent = new Date(),
            groupImage = '',
            totalScore = 0,
            admin = []
        } = req.body;

        if (!name || !description) {
            return res.status(400).send({ error: 'Name and description are required' });
        }

        const rows = await createGroupQuery(
            name,
            description,
            membersNames,
            memberTypes,
            membersIds,
            scoreByMember,
            lastEvent,
            nextEvent,
            groupImage,
            totalScore,
            admin
        );

        res.status(201).send(rows);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};


export const alterGroup = (req: any, res: any, next: any) => {
    const { id } = req.params;
    const { name, description, groupImage } = req.body;
    alterGroupQuery(id, name, description, groupImage).then((rows: any) => { res.status(200).send(rows) });
}

export const deleteGroup = (req: any, res: any, next: any) => {
    const { id } = req.params;
    deleteGroupQuery(id).then((rows: any) => { res.status(204).send(`Group ${id} deleted`) });
}

export const makeAdmin = (req: any, res: any, next: any) => {
    const { groupId, userId, userName } = req.body;
    makeAdminQuery(groupId, userId, userName).then((rows: any) => { res.status(200).send(rows) });
}

export const deleteAdmin = (req: any, res: any, next: any) => {
    const { groupId, userId } = req.body;
    removeAdminQuery(groupId, userId).then((rows: any) => { res.status(200).send(rows) });
}