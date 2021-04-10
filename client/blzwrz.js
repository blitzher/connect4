const WebSocket = require("ws");

const url = 'ws://localhost:8080/'

function main_export(id, say) {
	const ws = new WebSocket(url + id);
	ws.on('open', () => {
		const msg = say || 'connected to {id}'
		console.log(msg.replace(/{id}/, id));
	})
}

module.exports = main_export;

