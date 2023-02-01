"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const https_1 = require("https");
const socket_io_1 = __importDefault(require("socket.io"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = __importDefault(require("./socket"));
const fs_1 = __importDefault(require("fs"));
class Servidor {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(`${process.env.PORT}`);
        this.server = process.env.ENVIRONMENT == 'productivo'
            ? (0, https_1.createServer)({
                cert: fs_1.default.readFileSync('/cert/ssaver.gob.mx.crt'),
                key: fs_1.default.readFileSync('/cert/ssaver.gob.mx.key')
            })
            : http_1.default.createServer(this.app);
        this.io = socket_io_1.default(this.server, { /* Config */});
    }
    middlewares() {
        this.app.use((0, cors_1.default)({ origin: '*' }));
    }
    configurarSockets() {
        new socket_1.default(this.io);
    }
    execute() {
        this.middlewares();
        this.configurarSockets();
        this.server.listen(this.port, () => {
            process.env.ENVIRONMENT == 'productivo'
                ? console.log(`Server Socket Productivo ready in https://socket.ssaver.gob.mx:${this.port}`.america)
                : console.log(`Server Socket Pruebas ready in http://localhost:${this.port}`.rainbow);
        });
    }
}
exports.default = Servidor;
//# sourceMappingURL=server.js.map