const axios = require( 'axios' );
// RECIBE EL ID del usuario de SICA
const getAuthUserInfo = ( id_usuario ) => {
    return new Promise( async( resolve, reject ) => {
        try {
            const user = await axios.get( `${ process.env.IP_SICA }/api/incidencias/getInfoUsuario?id=${ id_usuario }` );
            resolve( user.data );
        }
        catch( err ) {
            console.log( err );
            reject( false );
        }
    } );
}

module.exports = getAuthUserInfo;