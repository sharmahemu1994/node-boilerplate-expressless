/**
 * handles the routes which can lead to creat  apis
 */

// Dependencies
const helpers = require('../utils/utils');

// create route container
const router = {};

router.index = (data, callback) => {
	if (data.method === 'get') {
		// read in index template as a string
		helpers.getTempalte('index', (err, str) => {
			if (!err) {
				callback(200, str, 'html');
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// ping handler
router.ping = (data, cb) => {
	// callback http status code and payload object
	cb(200);
};

router.notFound = (data, cb) => {
	helpers.getTempalte('error', (err, str) => {
		if (!err) {
			cb(404, str, 'html');
		} else {
			cb(500, undefined, 'html');
		}
	});
};

// defining a request router
router.routes = {
	'': router.index,
	'ping': router.ping
};

// export route module
module.exports = router;
