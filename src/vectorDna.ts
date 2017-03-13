import { Dna } from './GeneticFramework/dna'
import { Vector } from './vector'

export class VectorDna implements Dna<Vector[]>{

    fitness: number;

    constructor(public genes: Vector[], private target: Vector, public position?: Vector) { }

    crossOver(element: Dna<Vector[]>): Dna<Vector[]> {
        var mid = Math.floor(Math.random() * this.genes.length);
        return new VectorDna(this.genes.slice(0, mid).concat(element.genes.slice(mid)), this.target);
    }

    mutated(): Vector[] {
        for (var i = 0; i < this.genes.length; i++) {
            if (Math.random() < 0) {
                this.genes[i] = Vector.random().mult(.2);
            }
        }
        return this.genes;
    }

    evaluate(): number {
        return Math.pow(this.fitness = 1 / this.target.dist(this.position), 30);
    }

}