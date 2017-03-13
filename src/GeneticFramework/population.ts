import { Dna } from './dna'

export class Population<T>{

    private buketSize = 500;
    private bucket = [];
    private size: number;

    constructor(private population: Dna<T>[]) {
        this.size = population.length;
    }

    nextGeneration(): Dna<T>[] {
        for (var dna of this.population) {
            dna.evaluate();
        }
        this.fillBucket();
        this.population = [];
        for (var i = 0; i < this.size; i++) {
            let parentA = this.getRandomParentFromBucket();
            let parentB = this.getRandomParentFromBucket();
            let child = parentA.mergeWith(parentB);
            child.mutated();
            this.population.push(child);
        }
        return this.population;
    }

    private getRandomParentFromBucket(): Dna<T> {
        let rand = Math.floor(Math.random() * this.bucket.length);
        return this.bucket[rand];
    }

    private fillBucket() {
        let scoreArray = this.population.map(x => x.score);
        let total = scoreArray.reduce((prev, current) => current + prev);
        this.bucket = [];
        let normalizeScore = (score: number): number => Math.round(score / total * this.buketSize);
        let currentIndex = 0;
        this.population.forEach((dna: Dna<T>) => {
            let currentScore = normalizeScore(dna.score);
            for(let i =0; i< currentScore; i++){
                this.bucket.push(dna);
            }
        });
    }
}