import { Game } from './game/game';
import { Vector } from './physics/vector';

var game = new Game();
game.init(10, 1000, new Vector(100, 70), { width: 200, height: 1000 }, 900);
