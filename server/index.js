/* import main libraries */
const express = require('express');

/* initalize app and use express web sockets */
const app = express();
const expressWs = require('express-ws')(app);

/*  */
const manager = require('./manager');
const Game = require('./game');

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
 * @param {Number} status optional status - by default is 200
 */
function send(ws, obj, status) {
	obj.status = status;
	ws.send(JSON.stringify(obj));
}

const allShards = {}

app.ws('/:id', (ws, req) => {

	console.log('a user connected to game:', req.params.id);
	const shard = allShards[req.params.id] || new Game.Shard(req.params.id);
	const player = new Game.Player();

		ws.on('message', (message) => {
			const reply = manager(message, shard);
			
			/* assign callback ID to reply, if it was valid */
			reply.callbackId = (reply.valid) ? JSON.parse(message).callbackId : undefined;

			send(ws, reply, (reply.valid) ? 200 : 400)
		})

		ws.on('close', () => {
			console.log('player disconnected from', req.params.id)
			shard.removePlayer()
		})
});

app.listen(port, () => {
	console.log('listening on port ', port);
})




