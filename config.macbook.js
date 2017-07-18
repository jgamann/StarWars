/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var package = require('./package.json');

module.exports = {
    app_name    : package.name,
    session_timeout: 3600000,//1 hora en millis
    redis       : {
        host    : '127.0.0.1',
        port    : 6379,
        db      : 1
    },
    ssl         : {
        server_key: '/Users/txus/certs/webcamadmin/server.key',
        server_cert: '/Users/txus/certs/webcamadmin/server.crt',
        server_inter_cert: '/Users/txus/certs/webcamadmin/server.csr'
    },
    logs        : {
        rotates : 0,
        maxLogSize : 20000000,
        level   : "DEBUG",
        filename: "/var/log/starwars/server.log"
    }
};

/*
En PRO los certs estarán en 

/etc/ssl/certs/server.key
/etc/ssl/certs/server.cert
/etc/ssl/certs/server.intermediate.cert

*/