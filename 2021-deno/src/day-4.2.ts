import { Solution } from "../lib/cli.ts";
import { Board, RowsOfNumber, Tile } from "./day-4.1.ts";

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
    .reduce((boards: RowsOfNumber[], row, i) => {
      const boardIndex = i / BOARD_SIZE < 1 ? 0 : Math.floor(i / BOARD_SIZE);
      boards[boardIndex] = boards[boardIndex] || [];
      boards[boardIndex].push(row);
      return boards;
    }, [])
    .map((board) => new Board(board));

  debug(`Draws: ${draws.join(" ")}`);

  let lastToWinBoard: null | Board = null;
  let winnerDrawForLastBoard: null | number = null;
  for (const draw of draws) {
    for (const boardI in boards) {
      const board = boards[boardI];
      if (board.hasWon) {
        continue;
      }

      board.mark(draw);

      if (board.hasWon) {
        lastToWinBoard = board;
        winnerDrawForLastBoard = draw;
      }
    }
  }

  if (lastToWinBoard == null || winnerDrawForLastBoard == null) {
    console.error("Did not find a winning board");
    Deno.exit(1);
  }

  const sumOfLastBoardUnmarks = lastToWinBoard.tiles.reduce(
    (score: number, row: Tile[]) => {
      for (const tile of row) {
        if (!tile.isDrawn) {
          score += tile.number;
        }
      }
      return score;
    },
    0,
  );
  debug(`
Last found winner!

Draw: ${winnerDrawForLastBoard}
${lastToWinBoard}
`);

  answer(winnerDrawForLastBoard * sumOfLastBoardUnmarks);
};
