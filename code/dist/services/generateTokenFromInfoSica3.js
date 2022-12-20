"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = `${process.env.SECRET_KEY}`;
const generateTokenFromInfoSica3 = (infoQuery) => {
    let aux = {
        id_usuario: infoQuery.user_info.id_empleado,
        nombre_completo: infoQuery.user_info.nombre_completo,
        id_empleado: infoQuery.user_info.id_empleado,
        sexo: infoQuery.user_info.persona.sexo,
        matricula: infoQuery.empleado_info ? infoQuery.empleado_info.matricula : ''
    };
    // Una vez que tenemos la información lista creamos un token de acceso
    const jwtToken = jsonwebtoken_1.default.sign(aux, SECRET_KEY, {
        expiresIn: 108000
    });
    return jwtToken;
};
module.exports = generateTokenFromInfoSica3;
//# sourceMappingURL=generateTokenFromInfoSica3.js.map