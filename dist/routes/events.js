"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventsController_1 = require("../controllers/eventsController");
const router = express_1.default.Router();
router.get('/groups/:id', eventsController_1.getEventsForGroup);
router.get('/:id', eventsController_1.getEventById);
router.post('/', eventsController_1.createEvent);
router.patch('/:id', eventsController_1.alterEvent);
router.delete('/:id', eventsController_1.deleteEvent);
exports.default = router;
