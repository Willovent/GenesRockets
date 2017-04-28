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
        let nextPop = [];
        let totalFitness = this.population.reduce((prev, cur) => prev + cur.fitness, 0);
        for (var i = 0; i < this.size; i+=2) {
            let parentA = this.getRandomParentFromBucket(totalFitness);
            let parentB = this.getRandomParentFromBucket(totalFitness);
            let childs = parentA.crossOver(parentB);
            childs.forEach(child => {
                child.mutate();
                nextPop.push(<DnaGenes>child);
            });
        }
        return this.population = nextPop;
    }

    private getRandomParentFromBucket(totalFitness: number): DnaGenes {
        let rand = Math.random() * totalFitness;
        let index = -1;
        while(rand > 0){
            rand -= this.population[++index].fitness;
        }
        return this.population[index];
    }
}
