const jtw = require( 'jsonwebtoken' );
const SocketClient = require('./SocketClient');
const SocketNodo = require('./SocketNodo');

class SocketClientList {
    constructor() {
        this.clients = {};
    }

    addClient( token, origin, socket_info ) {
        const dir_ip_client = socket_info?.handshake.address;
        const hora_conexion_socket = socket_info?.handshake.time;
        const socket_id = socket_info?.id;
        jtw.verify( token, 'lf236', ( err, decoded ) => {
            const newSocket = new SocketNodo( socket_id, dir_ip_client, origin, hora_conexion_socket );
            const newClient = new SocketClient( decoded, socket_id, newSocket );
            /*
                Verifica que no exista ya una conexión activa ( esto se aplica para cuando el usuario abra sesión en diferentes pestañas 
                y podamos notificar a todas las pestañas )
                Si ya hay una conexión con el mismo usuario agregamos el id del nuevo socket a la lista de sockets actuales
            */
            let isUserAdd = Object.keys( this.clients ).includes( `${ newClient.id_usuario }` );
            if( isUserAdd ) {
                // console.log( 'YA HAY UNA CONEXIÓN VIGENTE' );
                return this.clients[ newClient.id_usuario ].socket_list.push( newSocket );
            }
            /*
                Si no hay una conexión vigente solo agregamos el objeto del nuevo cliente
            */
            return this.clients[ newClient.id_usuario ] = newClient;
        } )
    }

    getClientList() {
        let arr = [];
        Object.keys( this.clients ).map( key => {
            // Creamos una copia del objeto SIN TOCAR SU REFERENCIA
            const auxObj = Object.assign( {} , this.clients[ key ] );
            /*
                Filtramos una lista de los sockets de SICA3 y SICA4
                Despues del filtro obtenemos unicamente el ID del Socket
            */
            auxObj[ 'socket_list_sica3' ] = auxObj.socket_list.filter( socket_item => socket_item.origin == 'sica3' );
            auxObj[ 'socket_list_sica3' ] = auxObj[ 'socket_list_sica3' ].map( socket_item => socket_item.id_conexion );
            auxObj[ 'socket_list_sica4' ] = auxObj.socket_list.filter( socket_item => socket_item.origin == 'sica4' );
            auxObj[ 'socket_list_sica4' ] = auxObj[ 'socket_list_sica4' ].map( socket_item => socket_item.id_conexion );
            // LISTA CON LOS ID DE TODOS LOS SOCKETS
            auxObj[ 'id_socket' ] = auxObj.socket_list.map( socket_item => socket_item.id_conexion );
            arr.push( auxObj );
        } );
        return arr;
    }

    removeClient( id_socket ) {
        let id_user = null;
        // Buscamos el id del usuario dentro de la lista de objetos comparando los socket relacionados al objeto (usuario)
        this.getClientList().map( cli => {
            if( cli.id_socket.includes( id_socket ) ) {
                id_user = cli.id_usuario;
            }
        } );
        /* 
            Si hay más de una instacia de Socket conectada ( el usuario con multiples pestañas )
            Eliminamos el Socket del arreglo del Sockets del objeto relacionado al usuario
        */
        if( this.clients[ id_user ].socket_list.length > 1 ) {            
            // Creamos una nueva lista excluyendo el socket con el ID que se quiere eliminar
            // Esa lista se le asigna al atributo 'socket_list' del objeto del cliente
            return this.clients[ id_user ].socket_list = this.clients[ id_user ].socket_list.filter( socket_item => socket_item.id_conexion != id_socket );
        }
        /*
            Si solo existe un Socket se elimina directamente el elemento del objeto
        */
        delete this.clients[ `${ id_user }` ];
    }

    getClientById( id_client ) {
        return this.clients[ `${ id_client }` ];
    }

    getIdsSocketsByIdClient( id_client ) {
        return this.clients[ `${ id_client }` ].socket_list.map( socket_item => socket_item.id_conexion );
    }
}

module.exports = SocketClientList;