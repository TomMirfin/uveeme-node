"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = promise_1.default.createPool({
    database: 'uveeme',
    host: 'uveeme-db.chu6s8eo478x.eu-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'CM7CmTWDwSWPMonWs89n',
});
exports.default = pool;
