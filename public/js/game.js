
let bg = new Image();
let bl = new Image();
let rd = new Image();

const numX = 7;
const numY = 6;

let xScale = 0;
let yScale = 0;

let state = {};
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

export function eventHandler(event) {
	const left = event.button === 0;
	const right = event.button === 2;
	
	const screenX = event.layerX;
	const screenY = event.layerY;

	const {x, y} = screenToGrid(screenX, screenY)

	const move = {
		id : state.id,
		column : x
	}

	ws.send(JSON.stringify(move))

};

export function socketHandler(raw) {
	const obj = JSON.parse(raw.data);
	
	state = obj;
	board = obj.board;
}

export function redraw(canvas, ctx) {
	
	for (let row = 0; row < numY; row++) {
		for (let col = 0; col < numX; col++) {
			const el = board[row][col];
			
			if (el === 1) 
			ctx.drawImage(rd, col * xScale, row * yScale, xScale, yScale)
			
			else if (el === 2) 
			ctx.drawImage(bl, col * xScale, row * yScale, xScale, yScale);
			
			
		};
	};
	drawGrid(canvas, ctx);
}

