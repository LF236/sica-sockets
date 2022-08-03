const express = require( 'express' );
const http = require( 'http' );
const socketio = require( 'socket.io' );
const cors = require( 'cors' );
const Socket = require( './socket' );
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = http.createServer( this.app );
        this.io = socketio( this.server, { /* Config */ } );
    }

    middlewares() {
        this.app.use( cors( { origin: '*' } ) );
    }

    configurarSockets() {
        new Socket( this.io );
    }

    execute() {
        this.middlewares();
        this.configurarSockets();
        this.server.listen( this.port, () => {
            console.log( `Server Socket ready in http://localhost:${ this.port }`.america );
        } )
    }
}


module.exports = Server;