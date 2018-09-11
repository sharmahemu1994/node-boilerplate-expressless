/**
 * this flies handles the api request and return the data to be sent to the user
 *
 */

module.exports = (data, callback) => {
	//callback http status code and payload object
	callback(200, { message: 'hello' });
};
