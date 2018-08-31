/**
 * handles the small tasks which like body parsing etc
*/

// Dependences
const fs = require('fs');
const path = require('path');

// create helper container
const helpers = {};

// parse a JSON string to object in all cases
helpers.parseJsonToObject = (string) => {
	try {
		return JSON.parse(string);
	} catch (error) {
		return {};
	}
};

helpers.getTempalte = (templateName, cb) => {
	templateName = typeof (templateName) === 'string' ? templateName : false;
	if (templateName) {
		const templateDir = path.join(__dirname, '/../views/');
		fs.readFile(templateDir + templateName + '.html', 'utf8', (err, str) => {
			if (!err && str) {
				cb(false, str);
			} else {
				cb('no template could be found');
			}
		});
	} else {
		cb('valid template name required');
	}
};

module.exports = helpers;
