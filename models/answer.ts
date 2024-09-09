export class Answer {
    public word: string;
    public isHorizontal: boolean;

    constructor(word: string, isHorizontal: boolean) {
        this.word = word;
        this.isHorizontal = isHorizontal;
    }
}