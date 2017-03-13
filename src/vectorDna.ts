import { Dna } from './GeneticFramework/dna'
import { Vector } from './vector'

export class VectorDna implements Dna<Vector[]>{

    score: number;

    constructor(public genes: Vector[], private target: Vector, public position?: Vector) { }

    mergeWith(element: Dna<Vector[]>): Dna<Vector[]> {
        var mid = Math.floor(Math.random() * this.genes.length);
        return new VectorDna(this.genes.slice(0, mid).concat(element.genes.slice(mid)),this.target);
    }

    mutated(): Vector[] {
        for (var i = 0; i < this.genes.length; i++) {
            if (Math.random() < 0.002) {
                this.genes[i] = Vector.random(2, 2).add(-1);
            }
        }
        return this.genes;
    }

    evaluate(): number {
        return Math.pow(this.score = 1 / this.target.dist(this.position),20);
    }

}