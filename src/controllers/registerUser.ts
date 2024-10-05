
import { createUserQuery } from "../models/usersModels";
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

export const registerUser = async (req: any, res: any) => {
    const {
        email,
        password,
        name,
        profilePictureUrl = '',
        dob,
        phoneNumber = '',
        associatedGroupNames = [],
        associatedGroupId = []
    } = req.body;

    if (!email || !password || !name || !dob) {
        return res.status(400).send({ error: 'Name, email, password, and date of birth are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuid();  // Generate a unique ID for the user
        const updatedOn = new Date().toISOString();  // Capture the current time for updatedOn

        const result = await createUserQuery(
            id,
            hashedPassword,
            name,
            email,
            profilePictureUrl,
            dob,
            phoneNumber,
            updatedOn,
            associatedGroupNames,
            associatedGroupId
        );

        res.status(201).send({ success: true, id, result });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
