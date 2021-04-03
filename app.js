const { json } = require("express");
const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const util = require("./util");

const port = 8080;


function newId() {
	let num = Math.floor(Math.random() * 1000);
	while (boards[num] !== undefined) {
		num = Math.floor(Math.random() * 1000);
	}
	return num;
}

function newBoard(id, sock1, sock2) {
	
	const newBoard = [];
	for (let y = 0; y < 6; y++) {
		const row = [0, 0, 0, 0, 0, 0, 0];
		newBoard.push(row);
	}
	
	return {
		id,
		players: [
			sock1, sock2
		],
		board : newBoard,
		turn: 0
	}
}


app.use('/connect4', express.static("./public"));
app.use('/connect4/:id', express.static("./public"));

app.ws('/connect4/', (ws, req) => {
	ws.on('message', (msg) => {
		console.log(msg);
	});

	ws.send("hello!")

	console.log("new client");
});

app.ws('/connect4/:id', (ws, req) => {

	console.log("game connection");
	
	const gameId = Number.parseInt(req.params.id);

	if (util.boards[gameId] && util.boards[gameId].players[1] === undefined) {
		console.log("connecting new player to existing board");
		util.boards[gameId].players[1] = ws;
	}

	else if (util.boards[gameId]) {
		console.log("connecting spectator to existing board");
		
	}

	else {
		console.log("making new board ");
		const board = newBoard(gameId, ws)
		util.boards[gameId] = board;
	}
	/* in all three cases, send the game at index to player */
	ws.send(util.reformatBoard(util.boards[gameId],
		ws === util.boards[gameId].players[util.boards[gameId].turn]));

	ws.on('message', (msg) => {
		util.handle(msg, ws);
	})
})



app.listen(port, () => {
	console.log(`server listening on port ${port}`);
})