import colors from 'colors';
import express, { Express } from 'express';
import webpush  from 'web-push';
import bodyParser from 'body-parser';
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
                    }, this.app
                ) 
            : http.createServer( this.app );
        this.io = (io as any )( this.server, { /* Config */ } );
    }

    middlewares() {
        this.app.use( cors( { origin: '*' } ) );
        this.app.use( bodyParser.json() );
    }

    configurarSockets() {
        new SocketServer( this.io );
    }

    configurarPushSettings() {
        const publicVapidKey = 'BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo';
        const privateVapidKey = '3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM';
        
        webpush.setVapidDetails(
            'mailto:test@test.com',
            publicVapidKey,
            privateVapidKey
        );
        //* DEFINIR RUTA PARA SUBSCRIBIR USUARIOS
        this.app.post( '/subscribe', ( req, res ) => {
            const subscription = req.body;
            res.status( 201 ).json( {} );
            // CREATE PAYLOAD MESSAGE
            const payload = JSON.stringify( { title: 'Web push' } );
            // SEND NOTIFICATION
            webpush.sendNotification( subscription, payload );
        } )
    }

    execute() {
        this.middlewares();
        this.configurarSockets();
        this.configurarPushSettings();
        this.server.listen( this.port, () => {
            process.env.ENVIRONMENT == 'productivo'
                                        ? console.log( `Server Socket Productivo ready in https://socket.ssaver.gob.mx:${ this.port }`.america )
                                        : console.log( `Server Socket Pruebas ready in http://localhost:${ this.port }`.rainbow );
        } )
    }
}


export default Servidor;