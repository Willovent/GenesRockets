export interface Dna<T> {
    score: number
    genes: T
    mergeWith(element: Dna<T>): Dna<T>;
    mutated(): T
    evaluate(...param: any[]): number;
}