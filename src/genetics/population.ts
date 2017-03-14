import { Dna } from './dna'

export class Population<T, DnaGenes extends Dna<T> >{

    private bucket = [];
    private size: number;

    constructor(private population: DnaGenes[]) {
        this.size = population.length;
    }

    nextGeneration(): DnaGenes[] {
        for (var dna of this.population) {
            dna.evaluate();
        }
        this.fillBucket();
        this.population = [];
        for (var i = 0; i < this.size; i+=2) {
            let parentA = this.getRandomParentFromBucket();
            let parentB = this.getRandomParentFromBucket();
            let childs = parentA.crossOver(parentB);
            childs.forEach(x => x.mutate());
            this.population = this.population.concat(<DnaGenes[]>childs);
        }
        return this.population;
    }

    private getRandomParentFromBucket(): DnaGenes {
        let rand = Math.floor(Math.random() * this.bucket.length);
        return this.bucket[rand];
    }

    private fillBucket() {
        let scoreArray = this.population.map(x => x.fitness);
        let total = scoreArray.reduce((prev, current) => current + prev);
        this.bucket = [];
        let normalizeScore = (score: number): number => Math.round(score / total * this.size);
        let currentIndex = 0;
        this.population.forEach((dna: DnaGenes) => {
            let currentScore = normalizeScore(dna.fitness);
            for (let i = 0; i < currentScore; i++) {
                this.bucket.push(dna);
            }
        });
    }
}