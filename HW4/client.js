// Include Nodejs' net module.
const net = require('net');
//require('./server');
const Protocol = require('./protocol');
const protocol = new Protocol();

// encrypt
// The port number and hostname of the server.
const port = 8080;
const host = '127.0.0.1';

const socket = net.createConnection({port,host});

const note = [
    'enciphered',
    'message'
]

setTimeout(function() {
    for (let i=0; i<note.length; i++) {
        socket.write(protocol.encrypt(note[i]));
    }
}, 1000);
