/*
 * Import types 
 */

const WebSocket = require("ws");
import { customAlphabet } from "nanoid";
import { BoardPosition, CallbackFunctions, Command, GET, getBoardCallback, getPlayerCallback, getTileCallback, TARGETBOARD, TARGETPLAYER, TARGETTILE} from './types'
const alphabet = 'abcdefghijklmnopqrstuvwxyz-';
/* use simple alphabet and small size to make human readable */
const nanoid = customAlphabet(alphabet, 8);

const url = 'ws://localhost:8080/'
const callbackPark = new Map<String, Function>();

class ShardSocket {
	socket : WebSocket;
	constructor(url : string) {
		this.socket = new WebSocket(url);

	}
	send(
		command: { type: GET; target: TARGETBOARD },
		callback: getBoardCallback
	): void;
	send(
		command: { type: GET; target: TARGETTILE; pos: BoardPosition },
		callback: getTileCallback
	): void;
	send(
		command: { type: GET; target: TARGETPLAYER; id: string },
		callback: getPlayerCallback
	): void;
	send(command : {type : "get", target:"board"}, callback: getBoardCallback) : void;
	send(command : Command, callback : CallbackFunctions) : void {
		if (callback && typeof callback === 'function') {
			let id = nanoid(); // generate unique id
			while (callbackPark.has(id))
				id = nanoid(); // failsafe - if collision, avoid it
			callbackPark.set(id, callback); // (id, cb) in callbackPark
			command.callbackId = id;
		}

		this.socket.send(JSON.stringify(command));
	}

	set onopen(listener: (this: WebSocket, ev: Event) => any) {
        this.socket.onopen = listener;
    }

	set onmessage(listener: (this: WebSocket, ev:MessageEvent<any>) => any) {
		this.socket.onmessage = listener;
	}

	set onclose(listener: (this: WebSocket, ev:CloseEvent) => any) {
		this.socket.onclose = listener;
	}
}

/**
 * Connect to a BLZWRZ shard
 * @param options Options object
 * @param {number} options.id The shard id
 * @param {string} options.say What the socket says, once connected.
 * String literal `{id}` is replace by the shard id
 * @param callback Callback on the ShardSocket
 */
const connect = (options : {id: number, say?: string}, callback : Function) => {
	
	/* cast as any, as we overwrite some of the functionality
	 * of the regular WebSocket */
	const shardSocket = new ShardSocket(url + options.id);
	
	shardSocket.onopen = () => {
		const msg = options.say || 'connected to {id}'
		console.log(msg.replace(/{id}/g, String(options.id)));

		callback(shardSocket);
	};

	/* implement callbacks for sending commands */

	shardSocket.onmessage = (msg) => {
		const packet = JSON.parse(msg.data);
		const callbackFunction = callbackPark.get(packet.callbackId)


		/* if callback function was found, run it and delete it from park */
		if (callbackFunction) {
			callbackFunction(packet.body);
			callbackPark.delete(packet.callbackId);
		}
		/* uncaught message received */
		else {
			console.log(packet.body)
		}
	};
}

module.exports = {
	connect,
}