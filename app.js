/*
* server related tasks
*
*/

'use strict';

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const helpers = require('./utils/utils');
const util = require('util');
const debug = util.debuglog('server');
const router = require('./routes/index');

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
app.httpServer = http.createServer((req, res) => {
	app.unifiedServer(req, res);
});

app.httpsServerOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert.pem')
};

// instinciating https server
app.httpsServer = https.createServer(app.httpsServerOptions, (req, res) => {
	app.unifiedServer(req, res);
});

// servic logc for both http and https
app.unifiedServer = (req, res) => {
	// get url and parse it
	const parseURL = url.parse(req.url, true);

	// get the path form the url
	const path = parseURL.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// get the query string as an object
	const { query: queryString } = parseURL;

	// get the http method
	const method = req.method.toLowerCase();

	// get headers as an object
	const { headers } = req;

	// get payload if any
	const decoder = new stringDecoder('utf8');
	let payload = '';

	req.on('data', (data) => {
		payload += decoder.write(data);
	});

	req.on('end', () => {
		payload += decoder.end();
		console.log('-------router.routes[trimmedPath]------', router.routes[trimmedPath]);
		// choose handler this request should go else go to notFound
		const chooseHandler = typeof (router.routes[trimmedPath]) !== 'undefined' ? router.routes[trimmedPath] : router.notFound;

		// construct data object send to the handler
		const data = {
			trimmedPath,
			queryString,
			method,
			headers,
			payload: helpers.parseJsonToObject(payload)
		};

		try {
			chooseHandler(data, (statusCode, payload, contentType) => {
				app.processHandlerResponse(res, method, trimmedPath, statusCode, payload, contentType);
			});
		} catch (error) {
			debug(error);
			app.processHandlerResponse(res, method, trimmedPath, 500, { error: 'unknown error has occured' }, 'json');
		}
	});
};

app.processHandlerResponse = (res, method, trimmedPath, statusCode, payload, contentType) => {
	// determine the type of response (fallback to json);
	contentType = typeof (contentType) === 'string' ? contentType : 'json';

	// define default status code
	statusCode = typeof (statusCode) === 'number' ? statusCode : 200;

	// Return the response part as content specific
	let payloadString = '';

	if (contentType === 'json') {
		res.setHeader('Content-Type', 'application/json');
		payload = typeof (payload) === 'object' ? payload : {};
		payloadString = JSON.stringify(payload);
	}

	if (contentType === 'html') {
		res.setHeader('Content-Type', 'text/html');
		payloadString = typeof (payload) === 'string' ? payload : payload;
	}

	if (contentType === 'favicon') {
		res.setHeader('Content-Type', 'image/x-icon');
		payloadString = typeof (payload) === 'undefined' ? payload : '';
	}

	if (contentType === 'css') {
		res.setHeader('Content-Type', 'text/css');
		payloadString = typeof (payload) === 'undefined' ? payload : '';
	}

	if (contentType === 'image') {
		res.setHeader('Content-Type', 'image/png');
		payloadString = typeof (payload) === 'undefined' ? payload : '';
	}

	if (contentType === 'jpg') {
		res.setHeader('Content-Type', 'image/jpeg');
		payloadString = typeof (payload) === 'undefined' ? payload : '';
	}

	if (contentType === 'plain') {
		res.setHeader('Content-Type', 'text/plain');
		payloadString = typeof (payload) === 'undefined' ? payload : '';
	}
	// Return the response parts that are common to all content=types
	res.writeHead(statusCode);
	res.end(payloadString);
};

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
