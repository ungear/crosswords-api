import { Crossword } from "../models/crossword";
import { ExportService } from "./exportService";


export class CrosswordService {
  private static instance: CrosswordService;

  private _exportService: ExportService;  

  private constructor() {
    this._exportService = ExportService.getInstance();
  }

  public static getInstance(): CrosswordService {
    if (!CrosswordService.instance) {
      CrosswordService.instance = new CrosswordService();
    }
    return CrosswordService.instance;
  }

  public generateCrossword(words: string[] ): Crossword {
    const crossword = new Crossword();
    const wordsList = [...words];

    crossword.addAnswer(0, 0, words[0], true); // true for horizontal
    wordsList.shift();
    let round = 1;
    const attemptsNumber = 2;
    while (round <= attemptsNumber && wordsList.length > 0) {
      for (let i = 0; i < wordsList.length; i++) {
        let isSuccess = crossword.tryAddAnswer(wordsList[i], true); // true for horizontal
        if (!isSuccess) {
            isSuccess = crossword.tryAddAnswer(wordsList[i], false); // false for vertical
        }
        if (isSuccess) {
            wordsList.splice(i, 1);
            i--;
        }
      }
      round++;            
    }

    crossword.normalizeCoords();
    this._exportService.exportToCsvOnDisc(crossword);
    return crossword;
  }
}
