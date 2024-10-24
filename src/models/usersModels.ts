import db from "../database";

export const getAllUsersQuery = async () => {
  try {
    const [rows, fields] = await db.query("SELECT * FROM users");
    console.log(rows);
    return rows;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const getUserByIdQuery = async (id: string) => {
  try {
    const [rows, fields] = await db.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    return rows;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export const getUserByEmailQuery = async (email: string) => {
  try {
    const [rows, fields] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
};
export const createUserQuery = async (
  id: string,
  hashedPassword: string,
  name: string,
  email: string,
  profilePictureUrl: string,
  dob: string,
  phoneNumber: string,
  updatedOn: string,
  associatedGroupNames: string[],
  associatedGroupId: number[]
) => {
  try {
    const createdOn = new Date().toISOString();
    const [result] = await db.query(
      `INSERT INTO users (id, password, name, email, profilePictureUrl, dob, phoneNumber, createdOn, updatedOn, associatedGroupNames, associatedGroupsId) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        hashedPassword,
        name,
        email,
        profilePictureUrl,
        dob,
        phoneNumber,
        createdOn,
        updatedOn,
        JSON.stringify(associatedGroupNames),
        JSON.stringify(associatedGroupId),
      ]
    );

    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const alterUserQuery = async (
  id: string,
  fieldsToUpdate: {
    name?: string;
    email?: string;
    profilePictureUrl?: string;
    dob?: string;
    createdOn?: string;
    phoneNumber?: string;
    associatedGroupNames?: string[];
    associatedGroupId?: number[];
  }
) => {
  const updatedOn = new Date().toISOString().split("T")[0];

  try {
    let setClauses = [];
    let values = [];

    if (fieldsToUpdate.name) {
      setClauses.push("name = ?");
      values.push(fieldsToUpdate.name);
    }
    if (fieldsToUpdate.email) {
      setClauses.push("email = ?");
      values.push(fieldsToUpdate.email);
    }
    if (fieldsToUpdate.profilePictureUrl) {
      setClauses.push("profilePictureUrl = ?");
      values.push(fieldsToUpdate.profilePictureUrl);
    }
    if (fieldsToUpdate.dob) {
      setClauses.push("dob = ?");
      values.push(fieldsToUpdate.dob);
    }
    if (fieldsToUpdate.createdOn) {
      setClauses.push("createdOn = ?");
      values.push(fieldsToUpdate.createdOn);
    }
    if (fieldsToUpdate.phoneNumber) {
      setClauses.push("phoneNumber = ?");
      values.push(fieldsToUpdate.phoneNumber);
    }
    if (fieldsToUpdate.associatedGroupNames) {
      setClauses.push("associatedGroupNames = ?");
      values.push(JSON.stringify(fieldsToUpdate.associatedGroupNames));
    }
    if (fieldsToUpdate.associatedGroupId) {
      setClauses.push("associatedGroupsId = ?");
      values.push(JSON.stringify(fieldsToUpdate.associatedGroupId));
    }

    setClauses.push("updatedOn = ?");
    values.push(updatedOn);

    if (setClauses.length === 0) {
      throw new Error("No fields provided to update.");
    }

    values.push(id);

    const query = `
            UPDATE users
            SET ${setClauses.join(", ")}
            WHERE id = ?
        `;

    const [result] = await db.query(query, values);
    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUserQuery = async (userId: string) => {
  try {
    await db.query("DELETE FROM groupinvites WHERE invitedBy = ?", [userId]);
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [userId]);

    return result;
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
};
