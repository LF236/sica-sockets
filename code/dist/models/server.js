"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = __importDefault(require("./socket"));
class Servidor {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(`${process.env.PORT}`);
        this.server = http_1.default.createServer(this.app);
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
            console.log(`Server Socket ready in http://localhost:${this.port}`.america);
        });
    }
}
exports.default = Servidor;
//# sourceMappingURL=server.js.map