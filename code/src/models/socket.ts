import { Server, Socket } from 'socket.io';
import { InterfaceNuevoIngresoHospitalario } from '../interfaces/eventOnSica3NuevoIngreso';
import { InterfaceZumbido } from '../interfaces/eventOnZumbido';
const generateTokenFromInfoSica3 = require('../services/generateTokenFromInfoSica3');
const getAuthUserInfo = require('../services/getUserInfoSica3');
const SocketClientList = require( './SocketClientList' );
class SocketServer {
    private io : Server;
    public clients : any;
    constructor( io : Server ) {
        this.io = io;
        this.clients = new SocketClientList();
        this.socketEvents();
    }

    socketEvents() {
        this.io.on( 'connect', ( socket: Socket ) => {
            console.log( 'NUEVO CONEXION' );
            console.log( socket.id );
            socket.emit( 'current-clients', this.clients.getClientList() );
            // LISTENER PARA CONECTAR CLIENTES DE SICA4     

            socket.on( 'gege', ( data: string ) => {
                console.log( `Cliente directo de SICA4: ${ socket.handshake.address }`.magenta );
                // Sava Data
                const newClient = this.clients.addClient( data, 'sica4', socket );
                this.io.emit( 'new-client', newClient );
                console.log( this.clients.getClientList() )
                // Send Data to All Clients
                // this.io.emit( 'current-clients', this.clients.getClientList() );
            } );

            // LISTENER PARA CONECTAR CLIENTES DE SICA3            
            socket.on( 'connectFromSica3', async ( data: string ) => {
                console.log( `Cliente directo de SICA3: ${ socket.handshake.address }`.cyan );
                // Get data from API SICA3 { id_usuario, nombre_completo, sexo, matricula }
                let requestInfoUsuarioFromSica3 = await getAuthUserInfo( parseInt( data.replace( '/', '' ) ) );
                // SI EL USUARIO QUE SE QUIERE CONECTAR TIENE UN ID QUE NO EXISTE, ROMPEMOS LA RUTINA
                if( !requestInfoUsuarioFromSica3 ) return;
                const infoQuery = requestInfoUsuarioFromSica3;
                // Generar un token con la información recibida
                const token = generateTokenFromInfoSica3( infoQuery );
                // Agregar el cliente a la lista de clientes                
                this.clients.addClient( token, `sica3`, socket );                                
                // Send Data to All Clients
                // this.io.emit( 'current-clients', this.clients.getClientList() );   
            } );

            socket.on( 'disconnect', () => {
                console.log( 'ELIMINANDO CLIENTE' );
                let aux = this.clients.removeClient( socket.id );
                console.log( aux );
                this.io.emit( 'drop-client', aux );
                // Send new list of clients
                // this.io.emit( 'current-clients', this.clients.getClientList() );
            } );

            socket.on( 'zumbido', (  data : InterfaceZumbido ) => {
                const receptor = this.clients.getIdsSocketsByIdClient( data.id_receptor );                
                receptor.map( ( id_socket: string ) => {
                    socket.broadcast.to( id_socket ).emit( 'get_zumbido', {
                        modulo: 'Zumbido',
                        msg: 'Te ha enviado un Zumbido ✌',
                        emisor: data.data_emisor // { nombre_completo, matricula }
                    } );
                } );
            } )

            // EVENTOS DE SICA 3
            socket.on( 'sica3-nuevo-ingreso', ( data: InterfaceNuevoIngresoHospitalario ) => {
                // SI LA DATA TIENE EL ATRIBUTO ACCION Y ES IGUAL A 1 QUIERE DECIR QUE VA A CONSULTA DE ADULTOS
                if( data.accion == '1'  ) {
                    this.io.emit( 'nuevo-ingreso', {
                        'tipo_ingreso': data.tipo_ingreso,
                        'id_cama' : data.id_cama,
                        'id_paciente': data.id_paciente,
                        'clasificacion': data.clasificacion
                    } );
                }

                // SI LA DATA ES IGUAL A UNDEFINED QUIERE DECIR QUE VIENE DE OTRO TIPO DE TRIAGE
                if( data.accion == undefined ) {
                    this.io.emit( 'nuevo-ingreso', {
                        'tipo_ingreso': data.tipo_ingreso,
                        'id_cama' : data.id_cama,
                        'id_paciente': data.id_paciente,
                    } );
                }
            } );

            socket.on( 'getAllOnline', ( ) => {
                console.log( 'test' );
            } )
        } )
    }
}

export default SocketServer;