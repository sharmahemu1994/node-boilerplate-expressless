/**
 * handles the routes which can lead to creat  apis
 */

// Dependencies
//const routeHandler = require('../lib/');

// create route container
const route = {};

// defining a request router
route.router = {
	'ping': route.ping
	// 'users': handlers.users,
	// 'index': handlers.index,
	// 'example/error': handlers.exampleError
};

// ping handler
route.ping = (data, cb) => {
	console.log('------ping----------', data);
	// callback http status code and payload object
	cb(200);
};

route.notFound = (data, cb) => {
	cb(404);
};

// export route module
module.exports = route;
