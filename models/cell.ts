export class Cell {
    public x: number;
    public y: number;
    public letter: string;
    public wordIds: number[];

    constructor(x: number, y: number, letter: string, wordId: number) {
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.wordIds = [wordId];
    }
}