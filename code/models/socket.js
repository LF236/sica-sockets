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
                // Sava Data
                this.clients.addClient( data, `sica4=${ socket.id }` );
                // Send Data to All Clients
                this.io.emit( 'current-clients', this.clients.getClientList() );
            } );

            socket.on( 'connectFromSica3', async ( data ) => {
                // Get data from API SICA3 { id_usuario, nombre_completo, sexo, matricula }
                const infoQuery = await getAuthUserInfo( parseInt( data.replace( '/', '' ) ) );
                // Generar un token con la información recibida
                const token = generateTokenFromInfoSica3( infoQuery );
                // Agregar el cliente a la lista de clientes                
                this.clients.addClient( token, `sica3=${ socket.id }` );                
                // Send Data to All Clients
                this.io.emit( 'current-clients', this.clients.getClientList() );   
                // console.log( this.clients.clients );
            } );

            socket.on( 'disconnect', () => {
                this.clients.removeClient( socket.id );
                // Send new list of clients
                this.io.emit( 'current-clients', this.clients.getClientList() );
            } );

            socket.on( 'zumbido', data => {
                console.log( 'ZUMBIDO' );
                const receptor = this.clients.getClientById( data.id_receptor );
                console.log( receptor );
                receptor.id_socket.map( id_socket => {
                    console.log( id_socket.split( '=' )[ 0 ] );
                    socket.broadcast.to( id_socket.split( '=' )[ 1 ] ).emit( 'get_zumbido', {
                        modulo: 'Zumbido',
                        msg: 'Te ha enviado un Zumbido ✌',
                        emisor: data.data_emisor // { nombre_completo, matricula }
                    } );
                } );
            } )

            // EVENTOS DE SICA 3
            socket.on( 'sica3-nuevo-ingreso', data => {
                this.io.emit( 'nuevo-ingreso', {
                    'tipo_ingreso': data.tipo_ingreso,
                    'id_cama' : data.id_cama,
                    'id_paciente': data.id_paciente
                } );
            } );

            socket.on( 'getAllOnline', ( ) => {
                console.log( 'test' );
            } )
        } )
    }
}

module.exports = Socket;