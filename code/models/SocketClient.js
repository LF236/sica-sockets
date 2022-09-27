class SocketClient {
    constructor( tokenDecoded, id_socket ) {
        this.id_usuario = tokenDecoded.id_usuario,
        this.nombre_completo = tokenDecoded.nombre_completo,
        this.sexo = tokenDecoded.sexo,
        this.matricula = tokenDecoded.matricula,
        this.sockets_sica3 = [],
        this.sockets_sica4 = [],
        this.id_socket = [ id_socket ]
    }
}

module.exports = SocketClient;