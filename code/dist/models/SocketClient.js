"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketClient {
    constructor(tokenDecoded, id_socket, socket) {
        this.id_usuario = tokenDecoded.id_usuario,
            this.nombre_completo = tokenDecoded.nombre_completo,
            this.sexo = tokenDecoded.sexo,
            this.matricula = tokenDecoded.matricula,
            this.socket_list = [socket]; // NUEVA IMPLEMENTACION
    }
}
exports.default = SocketClient;
//# sourceMappingURL=SocketClient.js.map