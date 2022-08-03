class Socket {
    constructor( io ) {
        this.io = io;
        this.clients = {};
        this.socketEvents();
    }

    socketEvents() {
        this.io.on( 'connect', ( socket ) => {
            console.log( 'Cliente conectado'.red );
        } )
    }
}

module.exports = Socket;