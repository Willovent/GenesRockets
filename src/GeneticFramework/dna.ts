export interface Dna<T> {
    fitness: number
    genes: T
    crossOver(element: Dna<T>): Dna<T>;
    mutated(): T
    evaluate(): number;
}