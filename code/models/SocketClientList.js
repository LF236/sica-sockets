const jtw = require( 'jsonwebtoken' );
const SocketClient = require('./SocketClient');
class SocketClientList {
    constructor() {
        this.clients = {};
    }

    addClient( token, id_socket ) {
        jtw.verify( token, 'lf236', ( err, decoded ) => {
            const newClient = new SocketClient( decoded, id_socket );
            /*
                Verifica que no exista ya una conexión activa ( esto se aplica para cuando el usuario abra sesión en diferentes pestañas 
                y podamos notificar a todas las pestañas )
                Si ya hay una conexión con el mismo usuario agregamos el id del nuevo socket a la lista de sockets actuales
            */
            let isUserAdd = Object.keys( this.clients ).includes( `${ newClient.id_usuario }` );
            if( isUserAdd ) {
                // console.log( 'YA HAY UNA CONEXIÓN VIGENTE' );
                return this.clients[ newClient.id_usuario ].id_socket.push( id_socket );
                
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

            arr.push( this.clients[ key ] );
        } );
        return arr;
    }

    removeClient( id_socket ) {
        let id_user = null;
        // Buscamos el id del usuario dentro de la lista de objetos comparado los socket relacionados al objeto (usuario)
        this.getClientList().map( cli => {
            if( cli.id_socket.includes( id_socket ) ) {
                id_user = cli.id_usuario;
            }
        } );
        /* 
            Si hay más de una instacia de Socket conectada ( el usuario con multiples pestañas )
            Eliminamos el Socket del arreglo del Sockets del objeto relacionado al usuario
        */
        if( this.clients[ id_user ].id_socket.length > 1 ) {
            return this.clients[ id_user ].id_socket = this.clients[ id_user ].id_socket.filter( item => item != id_socket );
        }
        /*
            Si solo existe un Socket se elimina directamente el elemento del objeto
        */
        delete this.clients[ `${ id_user }` ];
    }
}

module.exports = SocketClientList;