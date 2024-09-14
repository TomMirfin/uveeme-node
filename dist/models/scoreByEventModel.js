"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScoresByEventQuery = void 0;
const database_1 = __importDefault(require("../database"));
const updateScoresByEventQuery = async (id, eventId, memberId, score) => {
    try {
        await database_1.default.query(`
            INSERT INTO scorebyevent (id, eventId, memberId, score)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE score = VALUES(score);
        `, [id, eventId, memberId, score]);
        await database_1.default.query(`
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
    }
    catch (error) {
        console.error('Error executing updateScoresByEventQuery:', error);
        throw error;
    }
};
exports.updateScoresByEventQuery = updateScoresByEventQuery;
