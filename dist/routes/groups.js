"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const groupsController_1 = require("../controllers/groupsController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', groupsController_1.getAllGroups);
router.get('/:id', groupsController_1.getGroupById);
router.get('/users/:id', groupsController_1.getGroupsContainingUser);
router.post('/', groupsController_1.createGroup);
router.patch('/:id', groupsController_1.alterGroup);
router.delete('/:id', groupsController_1.deleteGroup);
exports.default = router;
