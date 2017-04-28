import { Game } from './game/game';
import { Vector } from './physics/vector';

var game = new Game();
game.init(10, 3000, new Vector(100, 70), { width: 200, height: 900 }, 900, 300);
(<any>window).game = game;
(<any>window).Vector = Vector;