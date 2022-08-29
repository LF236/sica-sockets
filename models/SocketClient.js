class SocketClient {
    constructor( tokenDecoded, id_socket ) {
        this.id_usuario = tokenDecoded.id_usuario,
        this.nombre_completo = tokenDecoded.nombre_completo,
        this.sexo = tokenDecoded.sexo,
        this.matricula = tokenDecoded.matricula,
        this.id_socket = [ id_socket ]
    }
}

module.exports = SocketClient;