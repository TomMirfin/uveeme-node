"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerUser_1 = require("../controllers/registerUser");
const usersController_1 = require("../controllers/usersController");
const router = express_1.default.Router();
router.post('/', registerUser_1.registerUser);
router.post('/login', usersController_1.loginUser);
exports.default = router;
