const { json } = require("express");
const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);

const port = 8080;

const boards = {
	/* id : {
		id,
		players: [],
		board,
		turn,
	} */
}

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

function dropDownColumn(game, col) {
	console.log(game);
	for (let row = game.board.length ; row > 0 ; row--) {
		if ( game.board[row][col] === 0) {
			game.board[row][col] = game.board.turn + 1;
			game.turn = game.turn ? 0 : 1;

			return true;
		}
	}
	return false;
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

	if (boards[gameId] && boards[gameId].players[1] === undefined) {
		console.log("connecting new player to existing board");
		boards[gameId].players[1] = ws;
	}

	else if (boards[gameId]) {
		console.log("connecting spectator to existing board");
		
	}

	else {
		console.log("making new board ");
		const board = newBoard(gameId, ws)
		boards[gameId] = board;
	}
	/* in all three cases, send the game at index to player */
	const game = {
		id : gameId,
		board : boards[gameId].board,
		turn : boards[gameId].turn
	}
	ws.send(JSON.stringify(game));

	ws.on('message', (msg) => {
		console.log(msg);
		const move = JSON.parse(msg);
		const board = boards[move.id];

		if (!board) return;

		if ( board.players.indexOf(ws) === board.turn) {
			dropDownColumn(board, move.column)

		}


	})
})


app.listen(port, () => {
	console.log(`server listening on port ${port}`);
})