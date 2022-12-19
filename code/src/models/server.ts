import colors from 'colors';
import express, { Express } from 'express';
import http, {  } from 'http';
import io, { Server } from 'socket.io';
import cors from 'cors';
import SocketServer from './socket';

class Servidor {
    private app : Express;
    private server: any;
    private io : Server;
    public port: number;

    constructor() {
        this.app = express();
        this.port = parseInt( `${ process.env.PORT }` );
        this.server = http.createServer( this.app );
        this.io = (io as any )( this.server, { /* Config */ } );
    }

    middlewares() {
        this.app.use( cors( { origin: '*' } ) );
    }

    configurarSockets() {
        new SocketServer( this.io );
    }

    execute() {
        this.middlewares();
        this.configurarSockets();
        this.server.listen( this.port, () => {
            console.log( `Server Socket ready in http://localhost:${ this.port }`.america );
        } )
    }
}


export default Servidor;