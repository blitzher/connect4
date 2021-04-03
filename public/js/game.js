
let bg = new Image();
let bl = new Image();
let rd = new Image();

const numX = 7;
const numY = 6;

let mpos = {x : -1, y : -1};

let xScale = 0;
let yScale = 0;

let turn = false;
export let state = {};
let board = [];
for (let i = 0; i < numY; i++) board.push([]);

const _wl = window.location;
export const ws = new WebSocket(`ws://${_wl.host}${_wl.pathname}`);
ws.onopen = () => {
	console.log("connected");
};

ws.onmessage = (msg) => {
	console.log(msg);
}

ws.onclose = () => {
	console.log("disconnected")
}

function drawGrid(canvas, ctx) {
	
	ctx.strokeStyle = "#FFFFFF";
	ctx.lineWidth = 3
	/* draw horizontal line */
	for (let row = 1; row < numY; row++) {
		let dy = row * yScale;

		ctx.beginPath();
		ctx.moveTo(0, dy);
		ctx.lineTo(canvas.width, dy)
		ctx.stroke();
		
	};

	/* draw vertical line */
	for (let col = 1; col < numX; col++) {
		let dx = col * xScale;

		ctx.beginPath();
		ctx.moveTo(dx, 0);
		ctx.lineTo(dx, canvas.height);
		ctx.stroke();
	}
}

export function resizeCanvas(canvas) {
	const app = document.getElementById('app');
	const cs = getComputedStyle(app);

	/// these will return dimensions in *pixel* regardless of what
	/// you originally specified for image:
	const aspectRatio = numX / numY;

	const vtPadding = parseInt(cs.getPropertyValue('padding-top')) * 2
	const hzPadding = parseInt(cs.getPropertyValue('padding-left')) * 2
	const width = parseInt(cs.getPropertyValue('width')) / aspectRatio;
	const height = parseInt(cs.getPropertyValue('height'));

	const size = Math.min(width, height);
	/// now use this as width and height for your canvas element:
	canvas.width = (size * aspectRatio) - hzPadding;
	canvas.height = size - vtPadding;

	xScale = canvas.width / numX;
	yScale = canvas.height / numY;
}

export function init(canvas, ctx) {
	bl.src = `res/bl.svg`;
	rd.src = `res/rd.svg`;
	resizeCanvas(canvas);
}

function screenToGrid(x, y) {
	const gridX = Math.floor(x / xScale);
	const gridY = Math.floor(y / yScale);

	return { x : gridX, y : gridY};

}

export function clickHandler(event) {
	
	const screenX = event.layerX;
	const screenY = event.layerY;

	const {x, y} = screenToGrid(screenX, screenY)

	const move = {
		type : "move",
		id : state.id,
		column : x
	}

	ws.send(JSON.stringify(move))

};

export function moveHandler(event) {
	mpos.x = event.layerX;
	mpos.y = event.layerY;
}

export function socketHandler(raw) {
	const obj = JSON.parse(raw.data);
	console.log(obj);
	if (obj.type === "board") {
		state = obj;
		board = obj.board;

		if(obj.myturn) {
			document.getElementById("info").innerHTML = "Your turn"
		}
		else {
			document.getElementById("info").innerHTML = ""
		}
	}

	if (obj.type === "win" || obj.type === "lose") {
		document.getElementById("info").innerText = "You " + obj.type;
		document.getElementById("canvas").removeEventListener("click", clickHandler);
	}
}

export function redraw(canvas, ctx) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	/* draw icons of the grid */
	for (let row = 0; row < numY; row++) {
		for (let col = 0; col < numX; col++) {
			const el = board[row][col];
			
			if (el === 1) 
			ctx.drawImage(rd, col * xScale, row * yScale, xScale, yScale)
			
			else if (el === 2) 
			ctx.drawImage(bl, col * xScale, row * yScale, xScale, yScale);
			
			
		};
	};

	/* draw the grid */
	drawGrid(canvas, ctx);

	/* draw the column highlight */
	
	const col = screenToGrid(mpos.x, mpos.y).x;

	ctx.fillStyle="rgba(255, 255, 255, 0.2)"
	ctx.beginPath();
	
	ctx.rect(col * xScale, 0, xScale, canvas.height);
	ctx.fill();
}

