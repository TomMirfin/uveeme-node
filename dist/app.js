"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const groups_1 = __importDefault(require("./routes/groups"));
const database_1 = __importDefault(require("./database"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const events_1 = __importDefault(require("./routes/events"));
const scores_1 = __importDefault(require("./routes/scores"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.SERVER_PORT || 3000;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Middleware to parse JSON and URL-encoded bodies
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Route handlers
app.use('/users', users_1.default);
app.use('/groups', groups_1.default);
app.use('/events', events_1.default);
app.use('/scores', scores_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
database_1.default.query('SELECT * FROM users').then(([rows]) => { console.log(rows); });
database_1.default.query('SELECT * FROM `groups`').then(([rows]) => { console.log(rows); });
// Start the server
// app.listen(Number(PORT), '0.0.0.0', () => {
//     console.log(`Server is running on port ${PORT}`);
// });
// Properly close the database connection when needed
process.on('SIGINT', () => {
    database_1.default.end().then(() => {
        console.log('Database connection closed.');
        process.exit(0);
    }).catch(err => {
        console.error('Error closing the database connection:', err);
        process.exit(1);
    });
});
exports.default = app;
