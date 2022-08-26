const jtw = require( 'jsonwebtoken' );
const SocketClient = require('./SocketClient');
class SocketClientList {
    constructor() {
        this.clients = {};
    }

    addClient( token, id_socket ) {
        jtw.verify( token, 'lf236', ( err, decoded ) => {
            const newClient = new SocketClient( decoded, id_socket );
            this.clients[ newClient.id_usuario ] = newClient;
        } )
    }

    getClientList() {
        let arr = [];
        Object.keys( this.clients ).map( key => {
            arr.push( this.clients[ key ] );
        } );
        return arr;
    }
}

module.exports = SocketClientList;