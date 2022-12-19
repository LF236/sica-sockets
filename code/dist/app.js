"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require('colors');
const server_1 = __importDefault(require("./models/server"));
const newServer = new server_1.default();
newServer.execute();
//# sourceMappingURL=app.js.map