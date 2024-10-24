import db from "../database";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export const getEventByIdQuery = async (id: number) => {
  try {
    const query = `
            SELECT * FROM events
            WHERE id = ?
        `;
    const [rows] = await db.query(query, [id]);
    return rows;
  } catch (error) {
    console.error("Error fetching invite by ID:", error);
    throw error;
  }
};

export const getEventsForGroupQuery = async (groupId: number) => {
  try {
    const query = `
            SELECT * FROM events
            WHERE fromGroup = ?
        `;
    const [rows] = await db.query(query, [groupId]);
    return rows;
  } catch (error) {
    console.error("Error fetching invites for group:", error);
    throw error;
  }
};

export const createEventQuery = async (
  name: string,
  description: string,
  fromGroup: string,
  location: string,
  startDate: Date,
  endDate: Date,
  attendees: string[],
  scoreByMember: { memberId: string; score: number }[],
  status: string = "inactive"
) => {
  const id = uuidv4();

  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    throw new Error("Invalid start date");
  }
  if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
    throw new Error("Invalid end date");
  }

  const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
  const formattedEndDate = moment(endDate).format("YYYY-MM-DD");

  try {
    const groupQuery = `
            SELECT membersIds FROM \`groups\`
            WHERE id = ?
        `;
    const [groupRows]: any = await db.query(groupQuery, [fromGroup]);

    if (!Array.isArray(groupRows) || groupRows.length === 0) {
      throw new Error("Group not found");
    }

    const groupMemberIds = (groupRows[0] as any).membersIds || [];

    const allAttendees = [...new Set([...groupMemberIds, ...attendees])];

    const eventQuery = `
            INSERT INTO events (id, name, description, fromGroup, startDate, endDate, location, attendees, scoreByMember, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const eventValues = [
      id,
      name,
      description,
      fromGroup,
      formattedStartDate,
      formattedEndDate,
      location,
      JSON.stringify(allAttendees),
      JSON.stringify(scoreByMember),
      status,
    ];

    await db.query(eventQuery, eventValues);

    for (const { memberId, score } of scoreByMember) {
      await db.query(
        `
                INSERT INTO scorebyevent (eventId, memberId, score)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE score = VALUES(score);
            `,
        [id, memberId, score]
      );
    }

    await db.query(
      `
            UPDATE events
            SET scoreByMember = (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT('memberId', memberId, 'score', score)
                )
                FROM scorebyevent
                WHERE eventId = ?
            )
            WHERE id = ?;
        `,
      [id, id]
    );

    return { id };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const alterEventQuery = async (
  id: string,
  name?: string,
  description?: string,
  startDate?: string,
  endDate?: string,
  location?: string,
  attendeesToRemove: string[] = [],
  scoreByMember?: { memberId: string; score: number }[]
) => {
  let fieldsToUpdate: string[] = [];
  let values: any[] = [];

  let currentAttendees: string[] = [];
  if (attendeesToRemove.length > 0) {
    const [rows]: any = await db.query(
      `SELECT attendees FROM events WHERE id = ?`,
      [id]
    );
    currentAttendees = JSON.parse(rows[0]?.attendees || "[]");

    currentAttendees = currentAttendees.filter(
      (userId: string) => !attendeesToRemove.includes(userId)
    );
    values.push(JSON.stringify(currentAttendees));
    fieldsToUpdate.push(`attendees = ?`);
  }

  if (name) {
    fieldsToUpdate.push(`name = ?`);
    values.push(name);
  }
  if (description) {
    fieldsToUpdate.push(`description = ?`);
    values.push(description);
  }
  if (startDate) {
    fieldsToUpdate.push(`startDate = ?`);
    values.push(startDate);
  }
  if (endDate) {
    fieldsToUpdate.push(`endDate = ?`);
    values.push(endDate);
  }
  if (location) {
    fieldsToUpdate.push(`location = ?`);
    values.push(location);
  }

  if (scoreByMember && Array.isArray(scoreByMember)) {
    const [currentScoresRows]: any = await db.query(
      `SELECT scoreByMember FROM events WHERE id = ?`,
      [id]
    );

    let currentScores: { memberId: string; score: number }[] = [];

    if (currentScoresRows.length > 0) {
      const scoreByMemberValue = currentScoresRows[0]?.scoreByMember;

      if (typeof scoreByMemberValue === "string") {
        currentScores = JSON.parse(scoreByMemberValue);
      } else if (typeof scoreByMemberValue === "object") {
        currentScores = scoreByMemberValue;
      }
    }

    scoreByMember.forEach(({ memberId, score }) => {
      const existingScoreIndex = currentScores.findIndex(
        (s: { memberId: string; score: number }) => s.memberId === memberId
      );
      if (existingScoreIndex >= 0) {
        currentScores[existingScoreIndex].score += score;

        if (currentScores[existingScoreIndex].score < 0) {
          currentScores[existingScoreIndex].score = 0;
        }
      } else {
        currentScores.push({ memberId, score });
      }
    });

    fieldsToUpdate.push(`scoreByMember = ?`);
    values.push(JSON.stringify(currentScores));
  }

  if (fieldsToUpdate.length === 0) {
    throw new Error("No fields to update");
  }

  const query = `UPDATE events SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
  values.push(id);

  try {
    const [result] = await db.query(query, values);
    return result;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEventQuery = async (id: number) => {
  const query = `
        DELETE FROM events
        WHERE id = ?
    `;

  try {
    const [result] = await db.query(query, [id]);
    return result;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
