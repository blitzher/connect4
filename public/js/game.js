
let bg = new Image();
let bl = new Image();
let rd = new Image();

const numX = 7;
const numY = 6;

let xScale = 0;
let yScale = 0;

const board = [];
for (let i = 0; i < numY; i++) board.push([]);

board[0][0] = 2
board[2][5] = 1

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
	bg.onload = () => ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
	bg.src = `res/bg.png`;
	bl.src = `res/bl.png`;
	rd.src = `res/rd.png`;
}

export function redraw(canvas, ctx) {
	ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

	for (let row = 0; row < numY; row++) {
		for (let col = 0; col < numX; col++) {
			const el = board[row][col];

			if (el === 2) 
				ctx.drawImage(bl, col * xScale, row * yScale, xScale, yScale);
			
			else if (el === 1) 
				ctx.drawImage(rd, col * xScale, row * yScale, xScale, yScale)
			
		};
	};
}

