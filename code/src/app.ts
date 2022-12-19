require( 'dotenv' ).config();
require( 'colors' );
import Servidor from "./models/server";

const newServer = new Servidor();
newServer.execute();