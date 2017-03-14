import { Game } from './game/game';
import { Vector } from './physics/vector';

var game = new Game();
game.init(6, 50, new Vector(100, 70), { width: 200, height: 800 }, 300);