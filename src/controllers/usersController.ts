
import { alterUserQuery, createUserQuery, deleteUserQuery, getAllUsersQuery, getUserByIdQuery } from "../models/usersModels";


export const getUsers = async (req: any, res: any, next: any) => {
    console.log('getUsers');
    const rows = await getAllUsersQuery();
    console.log(rows);
    return res.status(200).send(rows);
}

export const getUserById = (req: any, res: any, next: any) => {
    const { id } = req.params;
    getUserByIdQuery(id).then((rows: any) => { res.status(200).send(rows) });

}

export const createUser = (req: any, res: any, next: any) => {
    const { name, email, profilePictureUrl, dob, phoneNumber, updatedOn, associatedGroupNames, associatedGroupId } = req.body;
    createUserQuery(name, email, profilePictureUrl, dob, phoneNumber, updatedOn, associatedGroupNames, associatedGroupId).then((rows: any) => { res.status(201).send(rows) });

}

export const alterUser = (req: any, res: any, next: any) => {
    const { id } = req.params;
    const { name, email, profilePictureUrl, dob, createdOn, phoneNumber, associatedGroupNames, associatedGroupId } = req.body;
    //update user
    alterUserQuery(id, name, email, profilePictureUrl, dob, createdOn, phoneNumber, associatedGroupNames, associatedGroupId).then((rows: any) => { res.status(200).send(rows) });
}



export const deleteUser = (req: any, res: any, next: any) => {
    const { id } = req.params;
    deleteUserQuery(id).then((rows: any) => { res.status(204).send(rows) });
}

