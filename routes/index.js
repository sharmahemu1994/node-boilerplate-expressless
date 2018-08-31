/**
 * handles the routes which can lead to creat  apis
 */

// Dependencies
//const routeHandler = require('../lib/');

// create route container
const router = {};

// ping handler
router.ping = (data, cb) => {
	console.log('------ping----------', data);
	// callback http status code and payload object
	cb(200);
};

router.notFound = (data, cb) => {
	console.log('-----notFound------');
	cb(404);
};

// defining a request router
router.routes = {
	'ping': router.ping
};

// export route module
module.exports = router;
