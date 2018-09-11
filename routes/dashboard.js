const helpers = require('../utils/helpers');

module.exports = (data, callback) => {
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
