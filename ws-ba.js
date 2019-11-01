// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";
process.title = 'node-serial-ws';

var usbPort = "COM7";

// Websocket
var webSocketsServerPort = 1337;
var webSocketServer = require('websocket').server;
var http = require('http');
var server = http.createServer(function (request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
var clients = [];

server.listen(webSocketsServerPort, function () {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

wsServer.on('request', function (request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');

    var index = clients.push(connection) - 1;

    // user sent some message
    connection.on('message', function (message) {
        onReceive(message);
    });

    // user disconnected
    connection.on('close', function (connection) {
        // if (userName !== false && userColor !== false) {
        //     console.log((new Date()) + " Peer "
        //         + connection.remoteAddress + " disconnected.");
        //     // remove user from the list of connected clients
        //     clients.splice(index, 1);
        // }
    });

});

function onReceive(msg) {
    //console.log(msg);
    console.log("ws msg:" + msg.utf8Data);
    writeToPort(msg.utf8Data);
    //   serialPort.write(msg);
    //onSerial(msg.utf8Data)
}

function onSerial(msg) {
    console.log("uart msg:" + msg);
    for (var i = 0; i < clients.length; i++)
        clients[i].sendUTF(msg);
}

// Serial port
var SerialPort = require("serialport");
var portName = usbPort;
var buffer = '';

var serialPort;

openPort();

function writeToPort(cmd) {
    //var cmd = '02';
    var buffer = new Buffer(1);
    buffer[0] = '0x' + cmd;
    console.log(buffer, cmd);
    serialPort.write(buffer, function (err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        // port.write('3E');
        // setTimeout(function(){
        //     port.write('3E');
        // }, 5000)

        // console.log(cmd);
    });
}

function requireUncached(module){
    delete require.cache[require.resolve(module)]
    return require(module)
}
function resetPort(){	
	state.PORT_INITIALIZED = false;
	if (serialPort.isOpen) {
		console.log("Port is open ...closing");
		serialPort.close();
	}	
	setTimeout(openPort, 30000);
}

function openPort(){
	try {
		console.log("opening port");
	        serialport = requireUncached("serialport");
		portparser  = new serialport.parsers.Readline;
		serialPort = new SerialPort(portName, {
            baudRate: 9600,
            // defaults for Arduino serial communication
            dataBits: 8,
            parity: 'even',
            stopBits: 1,
            flowControl: false
        });
		serialPort.pipe(portparser);
		// serialPort.on("open", function() {	
		// 	// openHandler(self);
        // });
        serialPort.on("open", function () {
            console.log('open serial communication');
            // Listens to incoming data
        
        });
        serialPort.on('data', function (data) {
            console.log("data from device", data);
            //let convert = data.toString('utf8');
            let json = JSON.stringify(data);
            let convert = JSON.parse(json);
            console.log(convert);
            //onSerial(JSON.stringify(convert));
             onSerial(convert.data[0]);
            // if(convert.data[0] == 64){
            //     writeToPort('02');
            // }
        
        
        
            // buffer += new String(data);
            // var lines = buffer.split("\n");
            // while (lines.length > 1)
            //     onSerial(lines.shift());
            // buffer = lines.join("\n");
        
        }); 
	} catch (ex){
		console.log("ERROR opening port\n" + ex);
	}
}


