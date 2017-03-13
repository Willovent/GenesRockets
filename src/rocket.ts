import { VectorDna } from './vectorDna'
import { Vector } from './vector'
import { Dna } from './genetics/dna'

export class Rocket {
    position: Vector;
    graphics: PIXI.Sprite;
    velocity: Vector = new Vector(0, 0);
    accleration: Vector = new Vector(0, 0);
    private currentStep = 0;
    public isCrashed = false;

    constructor(public stage: PIXI.Container, public dna: VectorDna) {
        this.position = new Vector(400, 800);
        this.graphics = PIXI.Sprite.fromImage('./rocket.png')
        this.graphics.anchor.set(0.5);
        stage.addChild(this.graphics);
        (<VectorDna>this.dna).position = this.position;
    }

    private applyForce(force: Vector) {
        this.accleration.add(force);
    }

    resetRocket(dna: VectorDna) {
        this.position.x = 400; this.position.y = 800;
        this.velocity.mult(0);
        this.dna = dna;
        this.currentStep = 0;
        this.dna.position = this.position;
        this.isCrashed = false;
    }

    update(target: Vector): boolean {
        if (!(this.currentStep > this.dna.genes.length - 1 || this.isCrashed || this.dna.succeed > 1)) {
            this.applyForce(this.dna.genes[this.currentStep]);
            this.velocity.add(this.accleration);
            this.position.add(this.velocity);
            this.accleration.mult(0);
            this.velocity.limit(4);
            this.currentStep;
            if (this.position.dist(target) < 30) {
                this.dna.succeed = (1 / this.currentStep) * this.dna.genes.length * 5;
            }
        }
        return ++this.currentStep > this.dna.genes.length - 1;
    }

    show(): void {
        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;
        this.graphics.rotation = this.velocity.getAngle() + Math.PI / 2;
    }
}