class SocketNodo {
    private id_conexion : string;
    private dir_ip : string;
    private origin : string;
    private fecha_conexion_socket : string;
    
    constructor( id_conexion: string, dir_ip: string, origin: string, date_conexion: string ) {
        this.id_conexion = id_conexion;
        this.dir_ip = dir_ip;
        this.origin = origin;
        this.fecha_conexion_socket = date_conexion;
    }
}

export default SocketNodo;