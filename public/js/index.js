import * as game from "./game.js";

function setupCanvas(el) {
	const canvas = $(el)
	const ctx = canvas.getContext("2d");

	game.resizeCanvas(canvas);

	return { canvas, ctx };
}
const $ = (id) => document.getElementById(id);

const ws = new WebSocket(`ws://${window.location.host}`);

ws.onopen = () => {
	console.log("connected");
	ws.send("ur mum")
};

const { canvas, ctx } = setupCanvas("canvas");
canvas.oncontextmenu = function (e) { e.preventDefault(); e.stopPropagation(); }

game.init(canvas, ctx);
window.addEventListener('resize', () => {
	game.resizeCanvas(canvas);
	game.redraw(canvas, ctx);
});

setInterval( () => game.redraw(canvas, ctx), 1000 / 60)