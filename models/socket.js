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

            socket.on( 'disconnect', () => {
                this.clients.removeClient( socket.id );
                // Send new list of clients
                this.io.emit( 'current-clients', this.clients.getClientList() );
            } )
        } )
    }
}

module.exports = Socket;