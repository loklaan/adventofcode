import { readFileSync } from 'fs'

class Tile {
  isDrawn = false;
  number;

  constructor (number) {
    this.number = number;
  }

  get [Symbol.toStringTag]() {
    return `${this.isDrawn ? '✔' : ''}${this.number}`
  }

  toString() {
    return this[Symbol.toStringTag]
  }

  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return this.number;
      case 'string':
        return this.number.toString();
      case 'default':
        return this.number;
      default:
        return null;
    }
  }
}

class Board {
  hasWon = false;
  tiles;

  constructor (rowsOfNumbers) {
    this.tiles = rowsOfNumbers.map(row => row.map(number => new Tile(number)))
  }

  get [Symbol.toStringTag]() {
    return '\n' + this.tiles.map(row => '| ' + row.map(tile => tile.toString()).join('\t')).join('\n');
  }

  toString() {
    return `Board${this.hasWon ? '✔' : ''}${this[Symbol.toStringTag]}`;
  }

  mark(draw) {
    for (const rowI in this.tiles) {
      const row = this.tiles[rowI]
      for (const columnI in row) {
        const tile = row[columnI]
        if (tile.number === draw) {
          tile.isDrawn = true;

          if (!this.hasWon && (
            // Is the row drawn?
            row.every(tile => tile.isDrawn) ||
            // Is the column drawn?
            this.tiles.every(row => row[columnI].isDrawn)
          )) {
            this.hasWon = true;
          }
        }
      }
    }
  }
}

const input = readFileSync('./io/day-4.txt', { encoding: 'utf-8' }).split('\n');
const draws = input[0].split(',').map(t => parseInt(t));
const BOARD_SIZE = 5;
const boards = input
  .slice(1)
  .filter(line => line)
  .map(line => line.split(/\s+/).filter(t => t).map(t => parseInt(t)))
  .reduce((boards, row, i) => {
    const boardIndex = i / BOARD_SIZE < 1 ? 0 : Math.floor(i / BOARD_SIZE);
    boards[boardIndex] = boards[boardIndex] || [];
    boards[boardIndex].push(row)
    return boards;
  }, [])
  .map(board => new Board(board));

console.log(draws.join(' '));

let winnerDraw = null;
for (const draw of draws) {
  if (winnerDraw != null) break;
  console.log(`Draw: ${draw}`);

  for (const board of boards) {
    board.mark(draw);
    if (board.hasWon) {
      winnerDraw = draw;
      const score = winnerDraw * (
        board.tiles.reduce((score, row) => {
          for (const tile of row) {
            if (!tile.isDrawn) score+= tile.number;
          }
          return score;
        }, 0)
      );
      console.log(`
Found winner!
${board}

  Score: ${score}
`);
      break;
    }
  }
}
