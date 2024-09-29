
import { createUserQuery } from "../models/usersModels";
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
export const registerUser = async (req: any, res: any) => {
    const { email, password, name, profilePictureUrl, dob, phoneNumber, associatedGroupNames, associatedGroupId } = req.body;

    if (!email || !password || !name || !dob) {
        return res.status(400).send({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuid();
        const updatedOn = new Date().toISOString();
        const rows: any = await createUserQuery(
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
        res.status(201).send(rows);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}
