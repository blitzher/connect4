const WebSocket = require("ws");
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const manager = require('./manager');
const { Socket } = require("socket.io");

const port = process.argv[2] || 8080;

const wss = expressWs.getWss('/');

app.use(express.json())

app.get('/', (req, res) => {
	res.status(200).send();
});

/**
 * a shorthand for sending a json object to a socket
 * @param {Socket} ws the receiving socket
 * @param {object} obj the object containing the data
 * @param {number} status optional status - by default is 200
 */
function send(ws, obj, status) {
	obj.status = status || 200;
	ws.send(JSON.stringify(obj)); 
}

app.ws('/:id', (ws, req) => {
	console.log('a user connected to game ', req.params.id);

	ws.on('message', (message) => {
		const command = manager(message);

		if (!command.valid) {
			send(ws, {body:'invalid command'}, 400);
		}


	})
});

app.listen(port, () => {
	console.log('listening on port ', port);
})




