const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);

const port = 8080;

app.use('/', express.static("./public"))

app.ws('/', (ws, req) => {
	ws.on('message', (msg) => {
		console.log(msg);
	});

	console.log("new client");
})


app.listen(port, () => {
	console.log(`server listening on port ${port}`);
})