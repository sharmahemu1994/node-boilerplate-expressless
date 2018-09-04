/*
* server related tasks
*
*/

'use strict';

// Dependencies
const http = require('http');
const https = require('https');
const fs = require('fs');
const util = require('util');
const server = require('./server');
const debug = util.debuglog('server');

// function to normalize a PORT into a number sting or false
const normalizePort = (val) => {
	let port = parseInt(val, 10);
	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}
	return false;
};

const httpPort = normalizePort(process.env.PORT || '3000');
const httpsPort = normalizePort(process.env.PORT || '3001');

// create server container
const app = {};

// instinciating http server
app.httpServer = http.createServer(server.handleRequest);

app.httpsServerOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert.pem')
};

// instinciating https server
app.httpsServer = https.createServer(app.httpsServerOptions, server.handleRequest);

app.init = () => {
	// start a server and ahave it listen to PORT 3000, where we can say it handles http server
	app.httpServer.listen(httpPort, () => {
		console.log('http server is listening on port 3000');
	});

	// start the https server
	app.httpsServer.listen(httpsPort, () => {
		console.log('https server is listening on port 3001');
	});
};

// Event listener for HTTP server "error" event.
// Catches if server event got any error.
const onError = (error) => {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof httpPort === 'string'
		? 'Pipe ' + httpPort
		: 'Port ' + httpPort;
	const bind2 = typeof httpsPort === 'string'
		? 'Pipe ' + httpsPort
		: 'Port ' + httpsPort;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges or' + bind2 + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use or' + + bind2 + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

// Event listener for HTTP server "listening" event.
const onListening = () => {
	const addr = app.httpServer.address();
	const addr2 = app.httpsServer.address();
	const bind = typeof addr === 'string'
		? 'pipe ' + addr + 'Https' + addr2
		: 'port ' + addr.port + 'Https' + addr2.port;
	debug('Listening on ' + bind);
};

app.httpServer.on('error', onError);
app.httpsServer.on('error', onError);
app.httpServer.on('listening', onListening);
app.httpsServer.on('listening', onListening);
// export modules
module.exports = app;
