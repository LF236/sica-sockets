require( 'dotenv' ).config();
require( 'colors' );
const Server = require( './models/server' );

const newServer = new Server();
newServer.execute();