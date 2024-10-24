"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const groups_1 = __importDefault(require("./routes/groups"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const events_1 = __importDefault(require("./routes/events"));
const scores_1 = __importDefault(require("./routes/scores"));
const auth_1 = __importDefault(require("./routes/auth"));
const cors_1 = __importDefault(require("cors"));
const invites_1 = __importDefault(require("./routes/invites"));
const passport_1 = __importDefault(require("passport"));
const passport_config_1 = require("./config/passport-config");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.SERVER_PORT || 3000;
(0, passport_config_1.passportConfig)();
app.use(passport_1.default.initialize());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Middleware to parse JSON and URL-encoded bodies
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Route handlersp
app.use("/users", users_1.default);
app.use("/groups", groups_1.default);
app.use("/events", events_1.default);
app.use("/scores", scores_1.default);
app.use("/auth", auth_1.default);
app.use("/invited", invites_1.default);
app.get("/auth/test", (req, res) => {
    res.send("Test route is working!");
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
// process.on('SIGINT', () => {
//     db.end().then(() => {
//         console.log('Database connection closed.');
//         process.exit(0);
//     }).catch(err => {
//         console.error('Error closing the database connection:', err);
//         process.exit(1);
//     });
// });
exports.default = app;
