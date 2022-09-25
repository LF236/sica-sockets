const generateTokenFromInfoSica3 = require('../services/generateTokenFromInfoSica3');
const getAuthUserInfo = require('../services/getUserInfoSica3');
const SocketClientList = require( './SocketClientList' );
class Socket {
    constructor( io ) {
        this.io = io;
        this.clients = new SocketClientList();
        this.socketEvents();
    }

    socketEvents() {
        this.io.on( 'connect', ( socket ) => {
            console.log( 'Cliente conectado'.red );            
            socket.on( 'gege', ( data ) => {
                console.log( 'ALMACENANDO INFORMACIÓN DE SESION' );
                // Sava Data
                this.clients.addClient( data, socket.id );
                // Send Data to All Clients
                this.io.emit( 'current-clients', this.clients.getClientList() );
            } );

            socket.on( 'connectFromSica3', async ( data ) => {
                const infoQuery = await getAuthUserInfo( parseInt( data.replace( '/', '' ) ) );
                const token = generateTokenFromInfoSica3( infoQuery );
                this.clients.addClient( token, socket.id );
                console.log( this.clients.getClientList() );
                // Send Data to All Clients
                this.io.emit( 'current-clients', this.clients.getClientList() );
                this.io.emit( 'dasdsadas', 'liuis fernando' );
                // Get data from API SICA3 { id_usuario, nombre_completo, sexo, matricula }

            } );
            socket.on( 'disconnect', () => {
                this.clients.removeClient( socket.id );
                // Send new list of clients
                this.io.emit( 'current-clients', this.clients.getClientList() );
            } );

            socket.on( 'zumbido', data => {
                const receptor = this.clients.getClientById( data.id_receptor );
                receptor.id_socket.map( id_socket => {
                    socket.broadcast.to( id_socket ).emit( 'get_zumbido', {
                        modulo: 'Zumbido',
                        msg: 'Te ha enviado un Zumbido &#1F921; ',
                        emisor: data.data_emisor // { nombre_completo, matricula }
                    } );
                } );
            } )
        } )
    }
}

module.exports = Socket;