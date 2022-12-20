import SocketNodo from "./SocketNodo";
import { InterfaceTokenFromSica } from "../interfaces/tokens";

class SocketClient {
    public id_usuario: number;
    public nombre_completo: string;
    public sexo: string;
    public matricula: string;
    public socket_list: Array<SocketNodo>;
    
    constructor( tokenDecoded : InterfaceTokenFromSica, id_socket: string, socket: SocketNodo ) {
        this.id_usuario = tokenDecoded.id_usuario,
        this.nombre_completo = tokenDecoded.nombre_completo,
        this.sexo = tokenDecoded.sexo,
        this.matricula = tokenDecoded.matricula,
        this.socket_list = [ socket ] // NUEVA IMPLEMENTACION
    }
}

export default SocketClient;