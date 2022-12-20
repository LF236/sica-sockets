"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SocketClient_1 = __importDefault(require("./SocketClient"));
const SocketNodo_1 = __importDefault(require("./SocketNodo"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('colors');
const SECRET_KEY = `${process.env.SECRET_KEY}`;
class SocketClientList {
    constructor() {
        this.clients = {};
    }
    addClient(token, origin, socket_info) {
        try {
            // Extraer información del Socket conectado
            const dir_ip_client = socket_info === null || socket_info === void 0 ? void 0 : socket_info.handshake.address;
            const hora_conexion_socket = socket_info === null || socket_info === void 0 ? void 0 : socket_info.handshake.time;
            const socket_id = socket_info === null || socket_info === void 0 ? void 0 : socket_info.id;
            jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.log('OMITIENDO CLIENTE');
                    console.log(`TOKEN CADUCADO - IP: ${dir_ip_client}`);
                    return;
                }
                // Nueva instancia de Socket
                const newSocket = new SocketNodo_1.default(socket_id, dir_ip_client, origin, hora_conexion_socket);
                // Nueva instancia de cliente
                const newClient = new SocketClient_1.default(decoded, socket_id, newSocket);
                /*
                    Verifica que no exista ya una conexión activa ( esto se aplica para cuando el usuario abra sesión en diferentes pestañas
                    y podamos notificar a todas las pestañas )
                    Si ya hay una conexión con el nuevo SocketClient a la lista del vigente del usuario
                */
                let isUserExists = Object.keys(this.clients).includes(`${newClient.id_usuario}`);
                if (isUserExists) {
                    return this.clients[newClient.id_usuario].socket_list.push(newSocket);
                }
                /*
                    Si no hay una conexión vigente solo agregamos el objeto del nuevo cliente
                */
                return this.clients[newClient.id_usuario] = newClient;
            });
        }
        catch (err) {
            console.log(`Error al tratar de agregar un socket desde la IP: ${socket_info.handshake.address}`.red);
            console.log(err);
        }
    }
    getClientList() {
        try {
            let arr = [];
            Object.keys(this.clients).map(key => {
                // Creamos una copia del objeto SIN TOCAR SU REFERENCIA
                // const auxObj = identity<SocketClient>;
                const auxObj = Object.assign({}, this.clients[key]);
                /*
                    Filtramos una lista de los sockets de SICA3 y SICA4
                    Despues del filtrclo obtenemos unicamente el ID del Socket
                    Use el tipo ANY de TypeScript ya que estamos agregando propiedaes adicionales que no pertenecen al SocketClient
                */
                auxObj['socket_list_sica3'] = auxObj.socket_list.filter((socket_item) => socket_item.origin == 'sica3');
                auxObj['socket_list_sica3'] = auxObj['socket_list_sica3'].map((socket_item) => socket_item.id_conexion);
                auxObj['socket_list_sica4'] = auxObj.socket_list.filter((socket_item) => socket_item.origin == 'sica4');
                auxObj['socket_list_sica4'] = auxObj['socket_list_sica4'].map((socket_item) => socket_item.id_conexion);
                // LISTA CON LOS ID DE TODOS LOS SOCKETS
                auxObj['id_socket'] = auxObj.socket_list.map((socket_item) => socket_item.id_conexion);
                arr.push(auxObj);
            });
            return arr;
        }
        catch (err) {
            console.log('Error al obtener la lista de clientes');
            console.log(err);
            return [];
        }
    }
    removeClient(id_socket) {
        var _a;
        try {
            let id_user = null;
            // Buscamos el id del usuario dentro de la lista de objetos comparando los socket relacionados al objeto (usuario)
            this.getClientList().map((cli) => {
                // Buscamos el la lista de TODOS los ids de sockets relaciones al cliente
                if (cli.id_socket.includes(id_socket)) {
                    id_user = cli.id_usuario;
                }
            });
            /*
                Si hay más de una instacia de Socket conectada ( usuario con multiples pestañas )1
                Eliminamos el id del socket dentro del arreglo Sockets relacionado a un Usuario
            */
            // Si el usuario relacionado al "id_socket" fue encontrado
            // La validación de que si el id_user es igual a 0, se agrego de manera especial para el usuario administrador
            if (id_user || id_user === 0) {
                // ----------------------------->LINEA PELIGROSA ---> PELIGRO ---> :c
                if (((_a = this.clients[id_user].socket_list) === null || _a === void 0 ? void 0 : _a.length) > 1) {
                    // Creamos una nueva lista excluyendo el socket con el ID que se quiere eliminar
                    // Esa lista se le asigna al atributo 'socket_list' del objeto del cliente
                    return this.clients[id_user].socket_list = this.clients[id_user].socket_list.filter(socket_item => socket_item.id_conexion != id_socket);
                }
                /*
                    Si solo existe un Socket se elimina directamente el elemento del objeto
                */
                return delete this.clients[`${id_user}`];
            }
            console.log(this.clients);
            console.log('EL SOCKET A ELIMINAR NO ESTA RELACIONADO CON ALGUN EMPLEADO');
        }
        catch (err) {
            console.log(`Error al eliminar el socket con el id: ${id_socket} `.red);
        }
    }
    getClientById(id_client) {
        try {
            return this.clients[`${id_client}`];
        }
        catch (err) {
            console.log(`Error al obtener la información del cliente conectado con el id: ${id_client}`.red);
        }
    }
    getIdsSocketsByIdClient(id_client) {
        try {
            return this.clients[`${id_client}`].socket_list.map(socket_item => socket_item.id_conexion);
        }
        catch (err) {
            console.log(`Error al obtener la lista de los sockets relacionado al cliente con el id: ${id_client}`.red);
        }
    }
}
module.exports = SocketClientList;
//# sourceMappingURL=SocketClientList.js.map