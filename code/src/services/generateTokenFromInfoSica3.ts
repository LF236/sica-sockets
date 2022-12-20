import { InterfaceInfoUsuarioSica3 } from '../interfaces/reqGetInfoUsuarioSica3';
import { InterfaceTokenFromSica } from '../interfaces/tokens';
import jwt, { Secret } from 'jsonwebtoken';

const SECRET_KEY : Secret = `${ process.env.SECRET_KEY }`;
const generateTokenFromInfoSica3 = ( infoQuery : InterfaceInfoUsuarioSica3 ) : string => {
    let aux : InterfaceTokenFromSica = {
        id_usuario: infoQuery.user_info.id_empleado,
        nombre_completo: infoQuery.user_info.nombre_completo,
        id_empleado: infoQuery.user_info.id_empleado,
        sexo: infoQuery.user_info.persona.sexo,
        matricula: infoQuery.empleado_info ? infoQuery.empleado_info.matricula : ''

    }
    // Una vez que tenemos la información lista creamos un token de acceso
    const jwtToken : string = jwt.sign(
        aux,
        SECRET_KEY,
        {
            expiresIn: 108000
        }
    );

    return jwtToken;
}

module.exports = generateTokenFromInfoSica3;