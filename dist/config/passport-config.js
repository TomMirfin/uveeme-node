"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportConfig = void 0;
// /config/passport.ts
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usersModels_1 = require("../models/usersModels");
const passportConfig = () => {
    // Define local strategy
    passport_1.default.use(new passport_local_1.Strategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const rows = await (0, usersModels_1.getUserByEmailQuery)(email);
            const user = rows[0];
            if (!user) {
                return done(null, false, { message: 'Invalid credentials.' });
            }
            const isMatch = await bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid credentials.' });
            }
            return done(null, user);
        }
        catch (error) {
            return done(error);
        }
    }));
    // Optional: If you're using sessions, this is how you serialize and deserialize
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport_1.default.deserializeUser(async (id, done) => {
        const stringId = id.toString();
        try {
            const rows = await (0, usersModels_1.getUserByIdQuery)(stringId);
            const user = rows[0];
            done(null, user);
        }
        catch (error) {
            done(error);
        }
    });
};
exports.passportConfig = passportConfig;
