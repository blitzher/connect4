/* Unit */
export interface Unit {
  /** The owner of this unit */
  owner: Player;
}

/* ResourceObject */
export interface ResourceObject {
  /** The amount of wood */
  wood: number;
  /** The amount of stone */
  stone: number;
  /** The amount of food */
  food: number;
  /** The amount of materials */
  materials: number;
  /** The amount of mythril */
  mythril: number;
  /** The amount of favor */
  favor: number;
}

/* BoardPosition */
export interface BoardPosition {
  x: number;
  y: number;
}

/* Player */
export interface Player {
  id: number;
}

/* Construct */
export interface Construct {
  /** The name ofthe construction */
  name: string;
  /** The `Tile` object that this construction occupy */
  tile: Tile;
  /** What this construction produces every cycle */
  produce: ResourceObject;
  /** The name oof the units this construction can spawn */
  spawns: Array<Unit>;
  /** The `Player` object of the owner of this construction */
  owner: Player;
}

/* Tile */
export interface Tile {
  /** The position of this Tile */
  pos: BoardPosition;
  /** If the tile contains trees */
  tree: boolean;
  /** If the tile contains stone */
  stone: boolean;
  /** If the tile contains water */
  water: boolean;
  /** Array of units currently occupying this tile */
  unit: Array<Unit>;
  /** The construct currently occupy the tile */
  construct: Construct | undefined;
}


type TypeConstant = GET | CONSTRUCT;
type GET = "get";
type CONSTRUCT = "construct";

type TargetConstant = TARGETTILE | TARGETBOARD | TARGETPLAYER
type TARGETTILE = "tile";
type TARGETBOARD = "board";
type TARGETPLAYER = "player";

type CallbackFunctions = 
    | getBoardCallback
    | getPlayerCallback
    | getTileCallback

interface getBoardCallback {
  (board: Tile[]): void;
}
interface getPlayerCallback {
  (player: Player): void;
}
interface getTileCallback {
  (tile: Tile): void;
}

export interface Command {
  type: TypeConstant;
  target?: TargetConstant;
  pos?: BoardPosition;
  id?: string;
  callbackId?: string;
}

export class ShardSocket {
  socket: WebSocket;

  constructor(url: string);

  /**
   * Send command to server
   * @param command The command that the server recieves
   * @param callback The callback on the return object
   */

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
}

export interface connect {
  (
    options: {
      id: Number;
      say?: String;
    },
    callback: {
      (shard: ShardSocket): void;
    }
  ): void;
}
