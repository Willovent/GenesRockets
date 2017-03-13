import { VectorDna } from './vectorDna'
import { Vector } from './vector'
import { Dna } from './GeneticFramework/dna'

export class Rocket {
    position: Vector;
    graphics: PIXI.Sprite;
    velocity: Vector = new Vector(0, 0);
    accleration: Vector = new Vector(0, 0);
    private currentStep = 0;

    constructor(public stage: PIXI.Container, public dna: Dna<Vector[]>) {
        this.position = new Vector(400, 800);
        this.graphics = PIXI.Sprite.fromImage('./rocket.png')
        this.graphics.anchor.set(0.5);
        stage.addChild(this.graphics);
        (<VectorDna>this.dna).position = this.position;
    }

    private applyForce(force: Vector) {
        this.accleration.add(force);
    }

    resetRocket(dna: Dna<Vector[]>) {
        this.position.x = 400; this.position.y = 800;
        this.velocity.mult(0);
        this.dna = dna;
        this.currentStep = 0;
        (<VectorDna>this.dna).position = this.position;
    }

    update(): boolean {
        if (this.currentStep > this.dna.genes.length - 1) return;
        this.applyForce(this.dna.genes[this.currentStep]);
        this.velocity.add(this.accleration);
        this.position.add(this.velocity);
        this.accleration.mult(0);
        this.velocity.limit(4);
        this.currentStep++;
        return this.currentStep > this.dna.genes.length - 1;
    }

    show(): void {
        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;
        this.graphics.rotation = this.velocity.getAngle() + Math.PI/2;
    }
}