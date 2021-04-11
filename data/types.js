
/* CommandType values */
/**
 * @typedef {('get'|'construct')} CommandType
 */

/* Unit */
/**
 * @typedef {Object} Unit
 * @property {Player} Owner The owner of the unit
 */

/* ResourceObject */
/**
 * @typedef {Object} ResourceObject
 * @property {Number} wood The amount of wood
 * @property {Number} stone The amount of stone
 * @property {Number} food The amount of food
 * @property {Number} materials The amount of materials
 * @property {Number} mythril The amount of mythril
 * @property {Number} favor The amount of favor 
 */ 

/* BoardPosition */
/**
 * @typedef {Object} BoardPosition
 * @property {Number} x
 * @property {Number} y
 */

/* Player */
/**
 * @typedef {Object} Player
 * @property {String} id The unique identifier of a player
 */

/* Construct */
/**
 * @typedef {Object} Construct
 * @property {String} name The name of the construction
 * @property {Tile} tile The `Tile` object that this construction occupy
 * @property {ResourceObject} produce What this construction produces, every cycle
 * @property {Array<Unit>} spawns The name of the units this construction can spawn
 * @property {Player} owner The `Player` object of the owner of this construction
 */

/* Tile */
/**
 * @typedef {Object} Tile
 * @property {BoardPosition} pos The position of this Tile
 * @property {Boolean} tree If the tile currently contains trees
 * @property {Boolean} stone If the tile currently contains stone
 * @property {Boolean} water If the tile currently contains water
 * @property {Player} owner Who the current owner of the tile is
 * @property {Construct} What construct currently occupy the tile
 * @property {Boolean} tree
 * 
 */

/* Command */
/**
 * @typedef {Object} Command
 * @property {CommandType} type The type of the command
 * @property {Tile|'board'} target The target of the command
 */

