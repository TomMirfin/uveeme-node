"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const usersModels_1 = require("../models/usersModels");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUser = async (req, res) => {
    const { email, password, name, profilePictureUrl = "", dob, phoneNumber = "", associatedGroupNames = [], associatedGroupId = [], } = req.body;
    if (!email || !password || !name || !dob) {
        return res
            .status(400)
            .send({
            error: "Name, email, password, and date of birth are required.",
        });
    }
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const id = (0, uuid_1.v4)();
        const updatedOn = new Date().toISOString();
        const result = await (0, usersModels_1.createUserQuery)(id, hashedPassword, name, email, profilePictureUrl, dob, phoneNumber, updatedOn, associatedGroupNames, associatedGroupId);
        res.status(201).send({ success: true, id, result });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
};
exports.registerUser = registerUser;
