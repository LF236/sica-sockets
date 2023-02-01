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
        this.server = process.env.ENVIRONMENT == 'productivo'
            ? createServer(
                    {
                        cert: fs.readFileSync('/cert/ssaver.gob.mx.crt'),
                        key: fs.readFileSync('/cert/ssaver.gob.mx.key')
                    }
                ) 
            : http.createServer( this.app );
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
            process.env.ENVIRONMENT == 'productivo'
                                        ? console.log( `Server Socket Productivo ready in https://socket.ssaver.gob.mx:${ this.port }`.america )
                                        : console.log( `Server Socket Pruebas ready in http://localhost:${ this.port }`.rainbow );
        } )
    }
}


export default Servidor;