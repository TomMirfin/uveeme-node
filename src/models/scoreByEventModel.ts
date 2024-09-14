
import db from '../database';


export const updateScoresByEventQuery = async (id: string, eventId: string, memberId: string, score: number) => {
    try {

        await db.query(`
            INSERT INTO scorebyevent (id, eventId, memberId, score)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE score = VALUES(score);
        `, [id, eventId, memberId, score]);


        await db.query(`
            UPDATE events
            SET scoreByMember = (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT('memberId', memberId, 'score', score)
                )
                FROM scorebyevent
                WHERE eventId = ?
            )
            WHERE id = ?;
        `, [eventId, eventId]);
    } catch (error) {
        console.error('Error executing updateScoresByEventQuery:', error);
        throw error;
    }
};
