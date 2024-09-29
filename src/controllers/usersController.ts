
import { alterUserQuery, createUserQuery, deleteUserQuery, getAllUsersQuery, getUserByEmailQuery, getUserByIdQuery } from "../models/usersModels";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import passport from 'passport';

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


export const createUser = async (req: any, res: any, next: any) => {
    const { name, email, profilePictureUrl, dob, phoneNumber, updatedOn, associatedGroupNames, associatedGroupId, password } = req.body;
    const id = uuidv4();
    if (!name || !email || !password) {
        return res.status(400).send({ error: 'Name, email, and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUserQuery(
            id,
            name,
            email,
            hashedPassword,
            profilePictureUrl,
            dob,
            phoneNumber,
            updatedOn,
            associatedGroupNames,
            associatedGroupId
        );

        res.status(201).send(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const alterUser = async (req: any, res: any, next: any) => {
    const { id } = req.params;
    const fieldsToUpdate = req.body;

    try {

        const result = await alterUserQuery(id, fieldsToUpdate);


        res.status(200).json({ message: 'User updated successfully', result });
    } catch (error) {

        res.status(500).json({ message: 'Error updating user', error });
    }
};



export const deleteUser = (req: any, res: any, next: any) => {
    const { id } = req.params;
    deleteUserQuery(id).then((rows: any) => { res.status(204).send(rows) });
}

export const loginUser = (req: any, res: any, next: any) => {
    passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).send({ token });
    })(req, res, next);
};


