"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invitesController_1 = require("../controllers/invitesController");
const router = express_1.default.Router();
router.get('/users/:id', invitesController_1.getInvitesForUser);
router.post('/', invitesController_1.sendInviteTo);
router.patch('/:inviteId/accept', invitesController_1.acceptInvite);
router.patch('/:inviteId/decline', invitesController_1.declineInvite);
router.get('/:id', invitesController_1.getInviteById);
router.get('/groups/:id', invitesController_1.getInvitesForGroup);
exports.default = router;
