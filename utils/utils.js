/**
 * handles the small tasks which like body parsing etc
*/

// create helper container
const helper = {};

// parse a JSON string to object in all cases
helpers.parseJsonToObject = (string) => {
    try {
        return JSON.parse(string);
    } catch (error) {
        return {};
    }
}

module.exports = helper