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

let boardsLeft = boards.length;
let lastToWinBoard = null;
let winnerDrawForLastBoard = null;
for (const draw of draws) {
  console.log(`Draw: ${draw}`);

  let markedBoards = [];
  for (const boardI in boards) {
    const board = boards[boardI];
    if (board.hasWon) {
      continue;
    }

    board.mark(draw);
    markedBoards.push(boardI)

    if (board.hasWon) {
      lastToWinBoard = board;
      winnerDrawForLastBoard = draw;
      console.log(`Found winning board. Boards left: ${boardsLeft}`)
    }
  }
  markedBoards.length > 0 && console.log(`Marked boards: ${markedBoards.join(', ')}`)
}

const sumOfLastBoardUnmarks = lastToWinBoard.tiles.reduce((score, row) => {
  for (const tile of row) {
    if (!tile.isDrawn) {
      console.log(`${tile.number} -> ${score + tile.number}`);
      score+= tile.number;
    }
  }
  return score;
}, 0)
console.log(`
Last found winner!

Draw: ${winnerDrawForLastBoard}
${lastToWinBoard}

  Score (${winnerDrawForLastBoard} x ${sumOfLastBoardUnmarks}): ${winnerDrawForLastBoard*sumOfLastBoardUnmarks}
`);
// console.log(boards.map(board => board.toString()).join('\n'));

//
// function reduceReports (reports, columnBitToKeep) {
//   let _reports = [...reports]
//   console.log('--')
//   let column = 0;
//   do  {
//     let zeroCount = 0;
//     let oneCount = 0;
//
//     for (let row = 0; row < _reports.length; row++) {
//       const columnBit = _reports[row][column];
//
//       if (columnBit === '0')
//         zeroCount++;
//       if (columnBit === '1')
//         oneCount++;
//     }
//
//     let bitToKeep = columnBitToKeep(zeroCount, oneCount);
//     _reports = _reports.filter(r => r[column] === bitToKeep);
//     console.log('column ' + column + ': reports=' + _reports.length);
//     // console.log(`   zeroCount: ${zeroCount}`)
//     if (_reports.length < 10) console.log(`   _reports: ${_reports}`)
//     // console.log(`    oneCount: ${oneCount}`)
//     console.log(`   bitToKeep: ${bitToKeep}`)
//
//     if (_reports.length > 1)
//       column++;
//   } while (_reports.length > 1);
//
//   console.log('Found at column ' + column);
//
//   return _reports[0]
// }
//
// const oxygenReport = reduceReports(
//   reports,
//   (zeroCount, oneCount) =>
//     (oneCount >= zeroCount ? '1' : '0')
// )
// const co2ScrubberReport = reduceReports(
//   reports,
//   (zeroCount, oneCount) =>
//     (zeroCount <= oneCount ? '0' : '1')
// )
//
// console.log(`
//      oxygenReport: ${oxygenReport}
// co2ScrubberReport: ${co2ScrubberReport}
//
//            answer: ${parseInt(oxygenReport, 2) * parseInt(co2ScrubberReport, 2) }
// `);
