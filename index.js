/**
 * primary file to start server
 * calls server js and other background scripts js which are supposed to run in background
 *
 */

// Dependencies
const cluster = require('cluster');
const os = require('os');
const app = require('./app');

// container for app
const server = {};

// Init function

server.init = () => {
	// To run server without clustering
	app.init();

	// To run server with clustering
	// if (cluster.isMaster) {
	// 	// calls other background process which are supposed to run on one core only
	// 	//example.init();

	// 	// fork the process
	// 	for (let i = 0; i < os.cpus().length; i++) {
	// 		cluster.fork();
	// 	}
	// } else {
	// 	// if we are not on the master thread
	// 	// start server
	// 	server.init();
	// }
};

// execute init function
server.init();

// export module
module.exports = server;
