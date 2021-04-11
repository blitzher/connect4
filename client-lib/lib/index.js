"use strict";
/*
 * Import types
 */
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var nanoid_1 = require("nanoid");
var alphabet = 'abcdefghijklmnopqrstuvwxyz-';
/* use simple alphabet and small size to make human readable */
var nanoid = nanoid_1.customAlphabet(alphabet, 8);
var url = 'ws://localhost:8080/';
var callbackPark = new Map();
var ShardSocket = /** @class */ (function () {
    function ShardSocket(url) {
        this.socket = new WebSocket(url);
    }
    ShardSocket.prototype.send = function (command, callback) {
        if (callback && typeof callback === 'function') {
            var id = nanoid(); // generate unique id
            while (callbackPark.has(id))
                id = nanoid(); // failsafe - if collision, avoid it
            callbackPark.set(id, callback); // (id, cb) in callbackPark
            command.callbackId = id;
        }
        this.socket.send(JSON.stringify(command));
    };
    Object.defineProperty(ShardSocket.prototype, "onopen", {
        set: function (listener) {
            this.socket.onopen = listener;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShardSocket.prototype, "onmessage", {
        set: function (listener) {
            this.socket.onmessage = listener;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShardSocket.prototype, "onclose", {
        set: function (listener) {
            this.socket.onclose = listener;
        },
        enumerable: false,
        configurable: true
    });
    return ShardSocket;
}());
/**
 * Connect to a BLZWRZ shard
 * @param options Options object
 * @param {number} options.id The shard id
 * @param {string} options.say What the socket says, once connected.
 * String literal `{id}` is replace by the shard id
 * @param callback Callback on the ShardSocket
 */
var connect = function (options, callback) {
    /* cast as any, as we overwrite some of the functionality
     * of the regular WebSocket */
    var shardSocket = new ShardSocket(url + options.id);
    shardSocket.onopen = function () {
        var msg = options.say || 'connected to {id}';
        console.log(msg.replace(/{id}/g, String(options.id)));
        callback(shardSocket);
    };
    /* implement callbacks for sending commands */
    shardSocket.onmessage = function (msg) {
        var packet = JSON.parse(msg.data);
        var callbackFunction = callbackPark.get(packet.callbackId);
        /* if callback function was found, run it and delete it from park */
        if (callbackFunction) {
            callbackFunction(packet.body);
            callbackPark.delete(packet.callbackId);
        }
        /* uncaught message received */
        else {
            console.log(packet.body);
        }
    };
};
module.exports = {
    connect: connect,
};
