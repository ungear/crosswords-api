import { Answer } from "./answer";
import { Cell } from "./cell";

export class Crossword {
    questions: string[];
    answers: Answer[];
    cells: Cell[];
    verticalLinkingTargets: Cell[];
    horizontalLinkingTargets: Cell[];

    constructor() {
        this.questions = [];
        this.answers = [];
        this.cells = [];
        this.verticalLinkingTargets = [];
        this.horizontalLinkingTargets = [];
    }

    public addAnswer(startX: number, startY: number, word: string, question: string, isHorizontal: boolean): void {
        const answer = new Answer(word, isHorizontal);
        this.answers.push(answer);
        this.questions.push(question);
        const answerIndex = this.answers.length - 1;

        let currentX = startX;
        let currentY = startY;
        const crossingCells: Cell[] = [];

        for (let index = 0; index < word.length; index++) {
            const existingCellWithSameCoordinates = this.cells.find(c => c.x === currentX && c.y === currentY);
            if (existingCellWithSameCoordinates) {
                if (existingCellWithSameCoordinates.letter !== word[index]) 
                    throw new Error("These coordinates are occupied with a cell with a different letter");
                existingCellWithSameCoordinates.wordIds.push(answerIndex);
                crossingCells.push(existingCellWithSameCoordinates);
            } else {
                const cell = new Cell(currentX, currentY, word[index], answerIndex);
                this.cells.push(cell);
                if (isHorizontal)
                    this.verticalLinkingTargets.push(cell);
                else
                    this.horizontalLinkingTargets.push(cell);
            }

            if (isHorizontal) {
                currentX++;
            } else {
                currentY++;
            }
        }

        // make a crossing cell and neighbour cells unavailable for future crossing
        for (const crossingCell of crossingCells) {
            this.horizontalLinkingTargets = this.horizontalLinkingTargets.filter(c => c !== crossingCell);
            this.verticalLinkingTargets = this.verticalLinkingTargets.filter(c => c !== crossingCell);

            const cellUp = this.cells.find(c => c.x === crossingCell.x && c.y === crossingCell.y - 1);
            if (cellUp) this.horizontalLinkingTargets = this.horizontalLinkingTargets.filter(c => c !== cellUp);
                    
            const cellDown = this.cells.find(c => c.x === crossingCell.x && c.y === crossingCell.y + 1);
            if (cellDown) this.horizontalLinkingTargets = this.horizontalLinkingTargets.filter(c => c !== cellDown);
            
            const cellLeft = this.cells.find(c => c.x === crossingCell.x - 1 && c.y === crossingCell.y);
            if (cellLeft) this.verticalLinkingTargets = this.verticalLinkingTargets.filter(c => c !== cellLeft);

            const cellRight = this.cells.find(c => c.x === crossingCell.x + 1 && c.y === crossingCell.y);
            if (cellRight) this.verticalLinkingTargets = this.verticalLinkingTargets.filter(c => c !== cellRight);
        }
    }

    public tryAddAnswer(word: string, question: string, isHorizontal: boolean): boolean {
        const linkingTargets = isHorizontal
            ? this.horizontalLinkingTargets
            : this.verticalLinkingTargets;

        for (const cell of linkingTargets) {
            const firstCrossingIndex = word.indexOf(cell.letter);
            if (firstCrossingIndex >= 0) {
                const startX = isHorizontal
                    ? cell.x - firstCrossingIndex
                    : cell.x;
                const startY = isHorizontal
                    ? cell.y
                    : cell.y - firstCrossingIndex;

                // cells which will be occupied by the word if we start it from the selected point
                const potentialCells = word.split('').map((letter, index) => {
                    const x = isHorizontal
                        ? startX + index
                        : startX;
                    const y = isHorizontal
                        ? startY
                        : startY + index;
                    return { x, y, letter }; 
                });

                // existing cells on the word path
                const potentialCrossings = potentialCells
                    .map(pc => ({ existingCell: this.cells.find(c => c.x === pc.x && c.y === pc.y), potentialCell: pc }))
                    .filter(x => x.existingCell !== undefined);

                // check if ALL potentialCrossings are eligible
                const isExistingCellsHaveRightLettersInIntersections = potentialCrossings.every(x => 
                    linkingTargets.includes(x.existingCell!) && x.existingCell!.letter === x.potentialCell.letter);

                // check X cells when inserting "new"
                // . . p . .
                // X n e w X
                // . . n . .
                const preStartNeighbourCell = isHorizontal
                    ? this.cells.find(c => c.y === startY && c.x === startX - 1)
                    : this.cells.find(c => c.x === startX && c.y === startY - 1);
                const postEndtNeighbourCell = isHorizontal
                    ? this.cells.find(c => c.y === startY && c.x === startX + word.length)
                    : this.cells.find(c => c.x === startX && c.y === startY + word.length);
                const isNeighbourCellsOk = !preStartNeighbourCell && !postEndtNeighbourCell;

                // check X cells when inserting "new"
                // . X p X .
                // . n e w .
                // . X n X .
                const nonCrossingWordCells = potentialCells
                    .map(pc => ({ existingCell: this.cells.find(c => c.x === pc.x && c.y === pc.y), potentialCell: pc }))
                    .filter(x => x.existingCell === undefined);
                const occupiedCellsAroundNonCrossingCells =
                    nonCrossingWordCells.reduce((acc, cell) => {
                        const cellUp = this.cells.find(c => c.x === cell.potentialCell.x && c.y === cell.potentialCell.y - 1);
                        const cellDown = this.cells.find(c => c.x === cell.potentialCell.x && c.y === cell.potentialCell.y + 1);
                        const cellLeft = this.cells.find(c => c.x === cell.potentialCell.x - 1 && c.y === cell.potentialCell.y);
                        const cellRight = this.cells.find(c => c.x === cell.potentialCell.x + 1 && c.y === cell.potentialCell.y);
                        if (cellUp && isHorizontal) acc.push(cellUp);
                        if (cellDown && isHorizontal) acc.push(cellDown);
                        if (cellLeft && !isHorizontal) acc.push(cellLeft);
                        if (cellRight && !isHorizontal) acc.push(cellRight);
                        return acc;
                    }, [] as Cell[])

                const isCellsAroundNonCrossingCellsOk = occupiedCellsAroundNonCrossingCells.length === 0;
                if (isExistingCellsHaveRightLettersInIntersections && isNeighbourCellsOk && isCellsAroundNonCrossingCellsOk) { 
                    this.addAnswer(startX, startY, word, question, isHorizontal);
                    return true;
                }
            }
        }

        return false;
    }

    public normalizeCoords(): void { 
        const minX = Math.min(...this.cells.map(x => x.x));
        const minY = Math.min(...this.cells.map(x => x.y));
        this.cells.forEach(c => {
            c.x = c.x - minX;
            c.y = c.y - minY;
        });
    }
}