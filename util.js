const boards = {
    /* id : {
		id,
		players: [],
		board,
		turn,
	} */
};

function dropDownColumn(game, col) {
    for (let row = game.board.length - 1; row > 0; row--) {
        if (game.board[row][col] === 0) {
            game.board[row][col] = game.turn + 1;
            game.turn = game.turn ? 0 : 1;
            return true;
        }
    }
    return false;
}

/**
 * a wrapper for all message type handlers
 * @param {str} msg the incoming message as a raw string
 */
function handle(message, ws) {
	const msg = JSON.parse(message);
	
	switch (msg.type) {
		case "move":
			handleMove(msg, ws);
			break;
		case "reset":
			handleReset(msg, ws);
			break;
		default:
			break;
	}
}

function handleMove(move, ws) {
	console.log("handling move: ", move);
    const board = boards[move.id];
    if (!board) return;

    if (board.players.indexOf(ws) === board.turn) {
        dropDownColumn(board, move.column);

        board.players.forEach((sock) => {
            if (sock) sock.send(reformatBoard(board, sock === board.players[board.turn]));
		});
		
		if(connected4(board, ws, move.column)) {
			board.players.forEach((sock) => {
				if (sock && sock === ws) {
					sock.send(JSON.stringify({type:"win"}));
				}
				else if (sock) {
					sock.send(JSON.stringify({type:"lose"}));
				}
			});
		}
	}
}

function handleReset(msg, ws) {
	const newBoard = [];
	for (let y = 0; y < 6; y++) {
		const row = [0, 0, 0, 0, 0, 0, 0];
		newBoard.push(row);
	}

	boards[msg.id].board = newBoard;

	boards[msg.id].players.forEach(sock => {
		if (sock) 
			sock.send(reformatBoard(boards[msg.id], 
				boards[msg.id].players[boards[msg.id].turn] === sock));
	});
}

function reformatBoard(unformatted, myturn) {

	const formatted = {
		type : "board",
		id : unformatted.id,
		board : unformatted.board,
		turn : unformatted.turn,
		myturn,
	};

	return JSON.stringify(formatted);
}

function connected4(game, ws, col) {
	const playerTiles = game.players.indexOf(ws) + 1;

	const dirs = [
		{ x : 0, y : 1},   	// down
		{ x : 1, y : 1},   	// down-right
		{ x : 1, y : 0},	// right
		{ x : 1, y : -1},	// up-right
		{ x : -1, y : -1},	// up-left
		{ x : -1, y : 0},	// left
		{ x : -1, y : 1}		// down-left

	]

	let placedAt;
	for (let row = 0; row < game.board.length; row++) {
		if (game.board[row][col] > 0) {
			placedAt = {
				x: col,
				y: row,
			}
			break;
		}
	}
	
	for (let dirIndex = 0; dirIndex < dirs.length; dirIndex++) {
		const dir = dirs[dirIndex];
		
		let i;
		for (i = 1; i < 4;) {
			const el = {
				x : placedAt.x + dir.x * i,
				y : placedAt.y + dir.y * i
			}
			
			if (!game.board[el.y] || game.board[el.y][el.x] !== playerTiles)
				break;
			i++;
		}
		if (i === 4)
			return true;
	}

	return false;
}



module.exports = {
    handle,
	boards,
	reformatBoard
};
