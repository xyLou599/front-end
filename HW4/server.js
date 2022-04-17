const net = require('net');
const Protocol = require('./protocol');
const protocol = new Protocol();
// The port on which the server is listening.
const port = 8080;
const host = '127.0.0.1';

let bufferleft = null;
let packLen = 0;

let server = net.createServer();
server.listen(port,host);
server.on('listening', () => {
    console.log('socket listening');
});
server.on('connection', socket => {
    console.log('new client arrived');

    socket.on('data', buffer => {
        if(bufferleft)
            buffer = Buffer.concat([bufferleft,buffer]);

        while (packLen = protocol.packLen(buffer)) {
            const pack = buffer.slice(0, packLen);
            buffer = buffer.slice(packLen);
            const result = protocol.decrypt(pack);
            console.log(result.body);
        }

        bufferleft=buffer; 
    })

    socket.on('end',() => {
        console.log('socket end');
    });
    socket.on('close', () => {
        console.log('socket close');
    });
    socket.on('error', (e) => {
        console.log(e);
    });
});
