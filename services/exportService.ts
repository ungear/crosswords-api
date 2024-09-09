import fs from 'fs';
import { Crossword } from '../models/crossword';

export class ExportService {
  private static instance: ExportService;

  private constructor() {}

  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  public exportToCsvOnDisc(crossword: Crossword): boolean {
    try {
      const writer = fs.createWriteStream('test.csv');
      const columnsNumber = Math.max(...crossword.cells.map(x => x.x));
      const table = crossword.cells
        .reduce((acc, cell) => {
          if (!acc[cell.y]) acc[cell.y] = [];
          acc[cell.y].push(cell);
          return acc;
        }, {} as { [key: number]: typeof crossword.cells })

      Object.entries(table)
        .sort(([a], [b]) => Number(a) - Number(b))
        .forEach(([_, group]) => {
          group.sort((a, b) => a.x - b.x);
          let line = '';
          for (let i = 0; i <= columnsNumber; i++) {
            const crosswordCell = group.find(c => c.x === i);
            if (crosswordCell === undefined) {
              line += ' ,';
            } else {
              line += `${crosswordCell.letter},`;
            }
          }
          writer.write(line + '\n');
        });

      writer.end();
      return true;
    } catch (error) {
      console.error('Error writing to CSV:', error);
      return false;
    }
  }
}