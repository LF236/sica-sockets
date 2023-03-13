import { Socket } from 'socket.io';
import SocketClient from "./SocketClient";
import SocketNodo from "./SocketNodo";
import jwt, { Secret } from 'jsonwebtoken';
require( 'colors' );
const SECRET_KEY : Secret = `${ process.env.SECRET_KEY }`;
interface DropUseMsgInterface {
    msg: 'ALL' | 'ONE';
    id_user: number;
    id_socket: string;
}

interface AddUserMsgInterface {
    msg: 'NEW' | 'APPEND';
    id_conection: any;
    conextion_info: any;
    id_user: string | number;
    user_all: any;
}

class SocketClientList {
    public clients : Record<string, SocketClient>;
    constructor() {
        this.clients = {};
    }

    addClient( token : string, origin : string, socket_info: Socket ) {
        try {
            // Extraer información del Socket conectado
            const dir_ip_client = socket_info?.handshake.address;
            const hora_conexion_socket = socket_info?.handshake.time;
            const socket_id = socket_info?.id;
            let nuevoCliente : AddUserMsgInterface | null = null;
            jwt.verify( token, SECRET_KEY, ( err, decoded: any ) => {
                if( err ) {
                    console.log( err );
                    console.log( 'OMITIENDO CLIENTE' );
                    console.log( `TOKEN CADUCADO - IP: ${ dir_ip_client }` );
                    return;
                }
                // Nueva instancia de Socket
                const newSocket = new SocketNodo( socket_id, dir_ip_client, origin, hora_conexion_socket );
                // Nueva instancia de cliente
                const newClient = new SocketClient( decoded, socket_id, newSocket );
                /*
                    Verifica que no exista ya una conexión activa ( esto se aplica para cuando el usuario abra sesión en diferentes pestañas 
                    y podamos notificar a todas las pestañas )
                    Si ya hay una conexión con el nuevo SocketClient a la lista del vigente del usuario
                */
                let isUserExists = Object.keys( this.clients ).includes( `${ newClient.id_usuario }` );
                // console.log( isUserExists );
                if( isUserExists ) {                    
                    this.clients[ newClient.id_usuario ].socket_list.push( newSocket );
                    nuevoCliente = {
                        id_user: newClient.id_usuario,
                        id_conection:  newSocket.id_conexion,
                        conextion_info: newSocket,
                        msg: 'APPEND',
                        user_all: null
                    }
                }
                /*
                    Si no hay una conexión vigente solo agregamos el objeto del nuevo cliente
                */
                else {
                    this.clients[ newClient.id_usuario ] = newClient;
                    nuevoCliente = {
                        id_user: newClient.id_usuario,
                        id_conection:  newSocket.id_conexion,
                        conextion_info: newSocket,
                        msg: 'NEW',
                        user_all: this.clients[ newClient.id_usuario ]
                    }
                }                
            } )
            return nuevoCliente;
        } catch( err ) {
            console.log( `Error al tratar de agregar un socket desde la IP: ${ socket_info.handshake.address }`.red );
            console.log( err );
        }
    }

    getClientList() {
        try{
            let arr : Array<SocketClient> = [];
            Object.keys( this.clients ).map( key => {
                // Creamos una copia del objeto SIN TOCAR SU REFERENCIA
                // const auxObj = identity<SocketClient>;
                const auxObj : SocketClient = Object.assign( {} , this.clients[ key ] );
                /*
                    Filtramos una lista de los sockets de SICA3 y SICA4
                    Despues del filtrclo obtenemos unicamente el ID del Socket
                    Use el tipo ANY de TypeScript ya que estamos agregando propiedaes adicionales que no pertenecen al SocketClient
                */
                ( auxObj as any )[ 'socket_list_sica3' ] = auxObj.socket_list.filter( ( socket_item: SocketNodo ) => socket_item.origin == 'sica3' );
                ( auxObj as any )[ 'socket_list_sica3' ] = ( auxObj as any )[ 'socket_list_sica3' ].map( ( socket_item: SocketNodo ) => socket_item.id_conexion );
                ( auxObj as any )[ 'socket_list_sica4' ] = auxObj.socket_list.filter( ( socket_item: SocketNodo ) => socket_item.origin == 'sica4' );
                ( auxObj as any )[ 'socket_list_sica4' ] = ( auxObj as any )[ 'socket_list_sica4' ].map( ( socket_item: SocketNodo ) => socket_item.id_conexion );
                // LISTA CON LOS ID DE TODOS LOS SOCKETS
                ( auxObj as any )[ 'id_socket' ] = auxObj.socket_list.map( ( socket_item: SocketNodo ) => socket_item.id_conexion );
                arr.push( auxObj );
            } );
            return arr;
        } catch( err ) {
            console.log( 'Error al obtener la lista de clientes' );
            console.log( err );
            return [];
        }
    }

    removeClient( id_socket: string ) {
        try {
            let res : DropUseMsgInterface | null = null;
            let id_user = null;
            // Buscamos el id del usuario dentro de la lista de objetos comparando los socket relacionados al objeto (usuario)
            this.getClientList().map( ( cli: any ) => {
                // Buscamos el la lista de TODOS los ids de sockets relaciones al cliente
                if( cli.id_socket.includes( id_socket ) ) {
                    id_user = cli.id_usuario;
                }
            } );
            /*
                Si hay más de una instacia de Socket conectada ( usuario con multiples pestañas )1
                Eliminamos el id del socket dentro del arreglo Sockets relacionado a un Usuario
            */
            // Si el usuario relacionado al "id_socket" fue encontrado
            // La validación de que si el id_user es igual a 0, se agrego de manera especial para el usuario administrador
            if( id_user || id_user === 0 ) {
                // ----------------------------->LINEA PELIGROSA ---> PELIGRO ---> :c
                // TODO Analizar BUG al error anterior
                console.log( this.getClientList() );
                console.log( this.clients[ id_user ] );
                console.log( this.clients[ id_user ].socket_list?.length );
                
                
                if( this.clients[ id_user ].socket_list?.length > 1 ) {            
                    console.log( 'DROP ONE' );
                    
                    // Creamos una nueva lista excluyendo el socket con el ID que se quiere eliminar
                    // Esa lista se le asigna al atributo 'socket_list' del objeto del cliente
                    this.clients[ id_user ].socket_list = this.clients[ id_user ].socket_list.filter( socket_item => socket_item.id_conexion != id_socket );
                    res = {
                        msg: 'ONE',
                        id_socket: id_socket,
                        id_user: id_user
                    }
                }
                /*
                    Si solo existe un Socket se elimina directamente el elemento del objeto
                */ 
                else {
                    console.log( 'DROP ALL' );
                    
                    delete this.clients[ `${ id_user }` ];
                    res = {
                        msg: 'ALL',
                        id_socket: id_socket,
                        id_user: id_user
                    }
                }
            }
            console.log( this.clients );
            return res;

            console.log( 'EL SOCKET A ELIMINAR NO ESTA RELACIONADO CON ALGUN EMPLEADO' );
        } catch( err ) {
            console.log( `Error al eliminar el socket con el id: ${ id_socket } `.red )
        }
    }

    getClientById( id_client: number ) {
        try{
            return this.clients[ `${ id_client }` ];
        } catch( err ) {
            console.log( `Error al obtener la información del cliente conectado con el id: ${ id_client }`.red );
        }
    }

    getIdsSocketsByIdClient( id_client: number ) {
        try{
            return this.clients[ `${ id_client }` ].socket_list.map( socket_item => socket_item.id_conexion );
        } catch( err ) {
            console.log( `Error al obtener la lista de los sockets relacionado al cliente con el id: ${ id_client }`.red );
        }

    }
}

module.exports = SocketClientList;