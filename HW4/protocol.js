class Protocol{
    constructor(){
        this.identifier      = new Buffer(2);
        this.sequence_number = new Buffer(2);
        this.data = new Buffer(10);
    }

    
    encrypt(data){
        let body = Buffer.from(data);
        for(let i=0; i<body.length; ++i){
            body[i] +=3;
        }
        
        console.log(body.toString());
        
        let header = []
        this.identifier.writeInt16BE(process.pid, 0);
        this.sequence_number.writeInt16BE(0x0, 0);

        header.push(this.identifier);
        header.push(this.sequence_number);

        //console.log(Buffer.concat([header[0],header[1],body]));
        return Buffer.concat([header[0],header[1],body]);
    }

    decrypt(buffer){
        const header = buffer.slice(0,4);
        let body = buffer.slice(2);
        for(let j=0; j<body.length; ++j){
            body[j] -=3;
        }

        this.sequenceNo++;
        return {
            sequenceNo: header.readInt16BE(),
            bodyLength: header.readInt16BE(),
            body: body.toString(),
        }
    }

    packLen(buffer) {
        if (buffer.length < 2) {
            return 0;
        }
        return 2 + buffer.readInt16BE(2);
    }
}

module.exports = Protocol;
