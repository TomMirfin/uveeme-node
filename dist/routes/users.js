"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const router = express_1.default.Router();
router.get('/', usersController_1.getUsers);
router.get('/:id', usersController_1.getUserById);
router.patch('/:id/change', usersController_1.alterUser);
router.delete('/:id', usersController_1.deleteUser);
router.post('/login', usersController_1.loginUser);
router.post('/register', usersController_1.createUser);
exports.default = router;
