import { Game } from './game/game';
import { Vector } from './physics/vector';

var game = new Game();
game.init(6, 50, new Vector(150, 70), { width: 300, height: 1800 }, 900);
