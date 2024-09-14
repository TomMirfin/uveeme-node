"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scoreByEventController_1 = require("../controllers/scoreByEventController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.patch('/update-scores', scoreByEventController_1.updateScoresByEvent);
exports.default = router;
