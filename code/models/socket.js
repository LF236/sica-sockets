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
            // LISTENER PARA CONECTAR CLIENTES DE SICA4         
            socket.on( 'gege', ( data ) => {
                // Sava Data
                this.clients.addClient( data, 'sica4', socket );
                // Send Data to All Clients
                this.io.emit( 'current-clients', this.clients.getClientList() );
            } );

            // LISTENER PARA CONECTAR CLIENTES DE SICA3            
            socket.on( 'connectFromSica3', async ( data ) => {
                // Get data from API SICA3 { id_usuario, nombre_completo, sexo, matricula }
                const infoQuery = await getAuthUserInfo( parseInt( data.replace( '/', '' ) ) );
                // Generar un token con la información recibida
                const token = generateTokenFromInfoSica3( infoQuery );
                // Agregar el cliente a la lista de clientes                
                // this.clients.addClient( token, `sica3=${ socket.id }` );                
                this.clients.addClient( token, `sica3`, socket );                                
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
                const receptor = this.clients.getIdsSocketsByIdClient( data.id_receptor );                
                receptor.map( id_socket => {
                    socket.broadcast.to( id_socket ).emit( 'get_zumbido', {
                        modulo: 'Zumbido',
                        msg: 'Te ha enviado un Zumbido ✌',
                        emisor: data.data_emisor // { nombre_completo, matricula }
                    } );
                } );
            } )

            // EVENTOS DE SICA 3
            socket.on( 'sica3-nuevo-ingreso', data => {
                console.log( 'FERNANDO' );
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