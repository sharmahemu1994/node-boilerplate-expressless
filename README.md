# node-boilerplate-expressless
## To create local ssl cetificate for https server
	openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
