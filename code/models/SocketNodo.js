class SocketNodo {
    constructor( id_conexion, dir_ip, origin, date_conexion ) {
        this.id_conexion = id_conexion;
        this.dir_ip = dir_ip;
        this.origin = origin;
        this.fecha_conexion_socket = date_conexion;
    }
}

module.exports = SocketNodo;