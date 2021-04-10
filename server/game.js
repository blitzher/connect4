
class Player {

}

class Construct {
	constructor(opts) {

	}
}

/**
 * A general class for tiles on the board
 */
class Tile {
	/**
	 * Initialize a new tile
	 * @param {Object} [opts] Options object
	 * @param {Boolean} [opts.tree]
	 * @param {Boolean} [opts.rock]
	 * @param {Player} [opts.owner]
	 * @param {Construct} [opts.construct]
	 * @param {Boolean} [opts.contested]
	 * @param {Boolean} [opts.water]
	 */
	constructor(opts) {
		/* assert that opts is an object,
		 * if it was undefined */
		if (!opts) opts = {};

		/* initialize opts properly, using default values */
		opts.tree = opts.tree || false;
		opts.rock = opts.rock || false;
		opts.owner = opts.owner || undefined;
		opts.construct = opts.construct || undefined;

		opts.contested = opts.contested || false;
		opts.water = opts.water || false;
	}
}

new Tile()

module.exports = class Game {
	constructor(id, size) {
		size = size || 8;
		this.id = id;

		/* initialize empty board */
		this.board = [];
		for (let y = 0; y < size; y++) {
			const row = [];
			for (let x = 0; x < size; x++) {
				row.push(new Tile());
			}
			this.board.push(row);
		}
	}
}







