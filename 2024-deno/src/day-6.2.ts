import { Solution } from "@/lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const grid = input.trim().split("\n").map((l) => l.split(""));
  const startPos = findStartPosition(grid);

  function simulateMovement(testGrid: string[][], pos: Position): boolean {
    const visited = new Set<string>();

    while (true) {
      const state = `${pos.x},${pos.y},${pos.dir}`;
      if (visited.has(state)) {
        return true; // Found a loop
      }
      visited.add(state);

      const dir = DIRECTIONS[pos.dir];
      const nextPos = { x: pos.x + dir.dx, y: pos.y + dir.dy };

      if (isOutOfBounds(nextPos, testGrid)) {
        return false;
      }

      if (testGrid[nextPos.y][nextPos.x] === "#") {
        pos.dir = TURN_RIGHT[pos.dir];
      } else {
        pos.x = nextPos.x;
        pos.y = nextPos.y;
      }
    }
  }

  function createsLoop(obstacleX: number, obstacleY: number): boolean {
    const testGrid = grid.map((row) => [...row]);
    testGrid[obstacleY][obstacleX] = "#";
    return simulateMovement(testGrid, { ...startPos });
  }

  let loopCount = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] !== "." || (x === startPos.x && y === startPos.y)) {
        continue;
      }
      if (createsLoop(x, y)) {
        loopCount++;
      }
    }
  }

  debug("Done.");
  answer(loopCount);
};

interface Position {
  x: number;
  y: number;
  dir: string;
}

interface Direction {
  dx: number;
  dy: number;
}

// Common constants and utility functions
const DIRECTIONS: Record<string, Direction> = {
  "^": { dx: 0, dy: -1 },
  ">": { dx: 1, dy: 0 },
  v: { dx: 0, dy: 1 },
  "<": { dx: -1, dy: 0 },
};

const TURN_RIGHT: Record<string, string> = {
  "^": ">",
  ">": "v",
  v: "<",
  "<": "^",
};

function findStartPosition(grid: string[][]): Position {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "^") {
        grid[y][x] = "."; // Clear the starting position
        return { x, y, dir: "^" };
      }
    }
  }
  throw new Error("No starting position found");
}

function isOutOfBounds(pos: { x: number; y: number }, grid: string[][]) {
  return (
    pos.y < 0 || pos.y >= grid.length || pos.x < 0 || pos.x >= grid[0].length
  );
}
