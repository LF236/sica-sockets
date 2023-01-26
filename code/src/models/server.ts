import colors from 'colors';
import express, { Express } from 'express';
import { readFileSync } from 'fs';
import path from 'path';

import http, {  } from 'http';
import { createServer } from 'https';
import io, { Server } from 'socket.io';
import cors from 'cors';
import SocketServer from './socket';
import fs from 'fs';

class Servidor {
    private app : Express;
    private server: any;
    private io : Server;
    public port: number;

    constructor() {
        this.app = express();
        this.port = parseInt( `${ process.env.PORT }` );
        this.server = createServer(
            {
                cert: fs.readFileSync('/cert/ssaver.gob.mx.crt'),
                key: fs.readFileSync('/cert/ssaver.gob.mx.key')
            }
        );
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
            console.log( `Server Socket ready in https://localhost:${ this.port }`.america );
        } )
    }
}


export default Servidor;