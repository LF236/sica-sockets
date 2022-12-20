class SocketNodo {
    public id_conexion : string;
    public dir_ip : string;
    public origin : string;
    public fecha_conexion_socket : string;
    
    constructor( id_conexion: string, dir_ip: string, origin: string, date_conexion: string ) {
        this.id_conexion = id_conexion;
        this.dir_ip = dir_ip;
        this.origin = origin;
        this.fecha_conexion_socket = date_conexion;
    }
}

export default SocketNodo;