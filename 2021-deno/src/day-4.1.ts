import { Solution } from "../lib/cli.ts";

export class Tile {
  public isDrawn: boolean = false;
  public number: number;

  constructor(num: Tile["number"]) {
    this.number = num;
  }

  get [Symbol.toStringTag]() {
    return `${this.isDrawn ? "✔" : ""}${this.number}`;
  }

  toString() {
    return this[Symbol.toStringTag];
  }

  [Symbol.toPrimitive](hint: string) {
    switch (hint) {
      case "number":
        return this.number;
      case "string":
        return this.number.toString();
      case "default":
        return this.number;
      default:
        return null;
    }
  }
}

export class Board {
  hasWon = false;
  tiles;

  constructor(rowsOfNumbers: RowsOfNumber) {
    this.tiles = rowsOfNumbers.map((row) => row.map((num) => new Tile(num)));
  }

  get [Symbol.toStringTag]() {
    return "\n" +
      this.tiles.map((row) =>
        "| " + row.map((tile) => tile.toString()).join("\t")
      ).join("\n");
  }

  toString() {
    return `Board${this.hasWon ? "✔" : ""}${this[Symbol.toStringTag]}`;
  }

  mark(draw: number) {
    for (const rowI in this.tiles) {
      const row = this.tiles[rowI];
      for (const columnI in row) {
        const tile = row[columnI];
        if (tile.number === draw) {
          tile.isDrawn = true;

          if (
            !this.hasWon && (
              // Is the row drawn?
              row.every((tile) => tile.isDrawn) ||
              // Is the column drawn?
              this.tiles.every((row) => row[columnI].isDrawn)
            )
          ) {
            this.hasWon = true;
          }
        }
      }
    }
  }
}

export type RowsOfNumber = number[][];

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  const input = (await loadInput()).split("\n");

  const draws = input[0].split(",").map((t) => parseInt(t));
  const BOARD_SIZE = 5;
  const boards = input
    .slice(1)
    .filter((line) => line)
    .map((line) =>
      line
        .split(/\s+/)
        .filter((t) => t)
        .map((t) => parseInt(t))
    )
    .reduce((rowsOfNumbersForBoards: RowsOfNumber[], row, i) => {
      const boardIndex = i / BOARD_SIZE < 1 ? 0 : Math.floor(i / BOARD_SIZE);
      rowsOfNumbersForBoards[boardIndex] = rowsOfNumbersForBoards[boardIndex] ||
        ([] as number[][]);
      rowsOfNumbersForBoards[boardIndex].push(row);
      return rowsOfNumbersForBoards;
    }, [])
    .map((board) => new Board(board));

  debug(`Draws: ${draws.join(" ")}`);

  let winnerDraw = null;
  for (const draw of draws) {
    if (winnerDraw != null) break;

    for (const board of boards) {
      board.mark(draw);
      if (board.hasWon) {
        winnerDraw = draw;
        const score = winnerDraw *
          board.tiles.reduce((score, row) => {
            for (const tile of row) {
              if (!tile.isDrawn) score += tile.number;
            }
            return score;
          }, 0);
        debug(`
Found winner!
${board}
`);
        answer(score);
        break;
      }
    }
  }
};
