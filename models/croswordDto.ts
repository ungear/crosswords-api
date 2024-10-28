import { Answer } from "./answer";
import { Cell } from "./cell";
import { Crossword } from "./crossword";

export class CrosswordDto{
  questions: string[];
  answers: Answer[];
  cells: Cell[];

  constructor(crossword: Crossword){
    this.questions = crossword.questions;
    this.answers = crossword.answers;
    this.cells = crossword.cells;
  }
}