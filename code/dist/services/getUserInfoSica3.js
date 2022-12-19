"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const axios = require('axios');
// RECIBE EL ID del usuario de SICA
const getAuthUserInfo = (id_usuario) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield axios.get(`${process.env.IP_SICA}/api/incidencias/getInfoUsuario?id=${id_usuario}`);
            resolve(user.data);
        }
        catch (err) {
            console.log(err);
            reject(false);
        }
    }));
};
module.exports = getAuthUserInfo;
//# sourceMappingURL=getUserInfoSica3.js.map