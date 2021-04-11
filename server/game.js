function boardDistance(tile1, tile2) {

}



/**
 * Helper class for resources
 */
class ResourceObject {
	/** Helper class for resources
	 * @param {Object} [opts] An object containing amounts of resources
	 * @param {Number} [opts.wood] The amount of wood
	 * @param {Number} [opts.stone] The amount of stone
	 * @param {Number} [opts.food] The amount of food
	 * @param {Number} [opts.materials] The amount of materials
	 * @param {Number} [opts.mythril] The amount of mythril
	 * @param {Number} [opts.favor] The amount of favor
	 */
	constructor(opts) {
		this.wood = opts.wood || 0;
		this.stone = opts.stone || 0;
		this.food = opts.food || 0;
		this.materials = opts.materials || 0;
		this.mythril = opts.mythril || 0;
		this.favor = opts.favor || 0;

	}
}

/**
 * Helper class for board tiles
 * @class
 */
class BoardPosition {
	/**
	 * A general class for board positions
	 * @param {Number} [x] The `x` coordinate, defaults to -1
	 * @param {Number} [y] The `y` coordinate, defaults to -1
	 */
	constructor(x, y) {
		this.x = (x !== undefined) ? x : -1;
		this.y = (y !== undefined) ? y : -1;
	}
}

class Player {
	constructor(id) {
		this.id = id;
	}
}
/**
 * A general class for constructions
 */
class Construct {
	/**
	 * A general class for constructions on tiles
	 * @param {Object} opts Options object
	 * @param {String} opts.name The name of the construction
	 * @param {Tile} opts.tile The `Tile` object that this construction occupy
	 * @param {ResourceObject} [opts.produce] What this construction produces, every cycle
	 * @param {Array} [opts.spawns] The name of the units this construction can spawn
	 * @param {Player} [opts.owner] The `Player` object of the owner of this construction
	 */
	constructor(opts) {
		/* required parameter */
		if (!(opts.name && opts.tile)) {
			throw new Error("construct missing required params,", opts);
		}

		this.name = opts.name;
		this.tile = opts.tile

		/* load optional parameters, with default values */
		this.produce = opts.produce || newResourceObject();
		this.spawns = opts.spawn || [];

		this.owner = opts.owner || undefined;
	}
}

/**
 * A general class for tiles on the board
 */
class Tile {
	/**
	 * Initialize a new tile
	 * @param {Object} [opts] Options object
	 * @param {BoardPosition} [opts.pos] BoardPosition of the tile
	 * @param {Boolean} [opts.tree] If the tile currently contains trees
	 * @param {Boolean} [opts.stone] If the tile currently contains stone
	 * @param {Boolean} [opts.water] If the tile currently contains water
	 * @param {Player} [opts.owner] Who the current owner of the tile is
	 * @param {Construct} [opts.construct] What construct currently occupy the tile
	 * @param {Boolean} [opts.contested] Undecided
	 */
	constructor(opts) {
		/* assert that opts is an object,
		 * if it was undefined */
		if (!opts) opts = {};

		/* initialize opts properly, using default values */
		this.pos = opts.pos || new BoardPosition();
		this.tree = opts.tree || false;
		this.stone = opts.stone || false;
		this.owner = opts.owner || undefined;
		this.construct = opts.construct || undefined;

		this.contested = opts.contested || false;
		this.water = opts.water || false;

	}
}

class Shard {
	/**
	 * Construct a new `Shard` object, able to run the game
	 * @param {Number} id The ID of the shard
	 * @param {Number} [size] The size of the shard, defaults to 16 (16x16).
	 */
	constructor(id, size) {
		console.log(`...making new Shard:${id}`);

		size = size || 2;
		this.id = id;
		this.players = [];
		this.started = false;

		/* initialize empty board */
		this.board = [];
		for (let y = 0; y < size; y++) {
			const row = [];
			for (let x = 0; x < size; x++) {
				row.push(new Tile({ pos: new BoardPosition(x, y) }));
			}
			this.board.push(row);
		}
	}

	/**
	 * Add a `Player` object to a shard
	 * @param {Player} addingPlayer The player to add
	 */
	addPlayer(addingPlayer) {
		this.players.push(addingPlayer);
	}

	/**
	 * Remove a `Player` object from a shard
	 * @param {Player} removingPlayer The player to remove
	 */
	removePlayer(removingPlayer) {
		this.players = this.players.filter(shardPlayers => shardPlayers.id !== removingPlayer.id);
	}

}

module.exports = {
	Shard,
	Player
}







