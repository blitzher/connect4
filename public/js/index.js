import * as game from "./game.js";

function setupCanvas(el) {
	const canvas = $(el)
	const ctx = canvas.getContext("2d");

	game.resizeCanvas(canvas);

	return { canvas, ctx };
}
const $ = (id) => document.getElementById(id);

game.ws.onopen = () => {
	console.log("connected");
};

game.ws.onmessage = game.socketHandler;

game.ws.onclose = () => {
	console.log("disconnected")
	window.location.reload();
}

const { canvas, ctx } = setupCanvas("canvas");
canvas.oncontextmenu = function (e) { e.preventDefault(); e.stopPropagation(); }

game.init(canvas, ctx);
window.addEventListener('resize', () => {
	game.resizeCanvas(canvas);
	game.redraw(canvas, ctx);
});

canvas.addEventListener("click", game.clickHandler)
// right click event listener
// canvas.addEventListener("contextmenu", game.clickHandler)
canvas.addEventListener("mousemove", game.moveHandler)

setInterval( () => game.redraw(canvas, ctx), 1000 / 60)

$("reset-btn").onclick = () => {
	canvas.addEventListener("click", game.clickHandler);
	game.ws.send(JSON.stringify({type: "reset", id:game.state.id}));
}