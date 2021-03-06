import { Vector } from '../physics/vector';

export class Obstacle {
    constructor(stage: PIXI.Container, private position: Vector, private radius) {
        var graphic = PIXI.Sprite.fromImage('./meteor1.png');
        graphic.position.x = position.x;
        graphic.position.y = position.y;
        graphic.width = radius * 2;
        graphic.height = radius * 2;
        graphic.anchor.set(.5, .5);
        stage.addChild(graphic);
    }

    checkColision(element: Vector): boolean {
        return this.position.dist(element) < this.radius;
    }
}