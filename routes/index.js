/**
 * handles the routes which can lead to creat  apis
 */

// Dependencies


// create route container
const route = {}

// defining a request router
route.router = {
    'ping': handlers.ping,
    'users': handlers.users,
    'index': handlers.index,
    'example/error': handlers.exampleError
}

route.notFound = (data, cb) => {
    cb(404)
}

// export route module
module.exports = route;
