import { getAllGroupsQuery, getAllGroupsWithUserQuery, getGroupByIdQuery, createGroupQuery, alterGroupQuery, deleteGroupQuery, addUserToGroupQuery } from "../models/groupsModels";

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


export const createGroup = (req: any, res: any, next: any) => {
    const { name,
        description,
        membersNames,
        memberTypes,
        membersIds,
        scoreByMember,
        lastEvent,
        nextEvent,
        groupImage,
        totalScore } = req.body;
    createGroupQuery(name,
        description,
        membersNames,
        memberTypes,
        membersIds,
        scoreByMember,
        lastEvent,
        nextEvent,
        groupImage,
        totalScore).then((rows: any) => { res.status(201).send(rows) });
}

export const alterGroup = (req: any, res: any, next: any) => {
    const { id } = req.params;
    const { name, groupImage } = req.body;
    alterGroupQuery(id, name, groupImage).then((rows: any) => { res.status(200).send(rows) });
}

export const deleteGroup = (req: any, res: any, next: any) => {
    const { id } = req.params;
    deleteGroupQuery(id).then((rows: any) => { res.status(204).send(rows) });
}