import SocketNodo from "./SocketNodo";
import { InterfaceTokenFromSica } from "../interfaces/tokens";

class SocketClient {
    private id_usuario: string;
    private nombre_completo: string;
    private sexo: string;
    private matricula: string;
    private socket_list: Array<SocketNodo>;
    
    constructor( tokenDecoded : InterfaceTokenFromSica, id_socket: string, socket: SocketNodo ) {
        this.id_usuario = tokenDecoded.id_usuario,
        this.nombre_completo = tokenDecoded.nombre_completo,
        this.sexo = tokenDecoded.sexo,
        this.matricula = tokenDecoded.matricula,
        this.socket_list = [ socket ] // NUEVA IMPLEMENTACION
    }
}

module.exports = SocketClient;