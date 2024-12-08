import { Solution } from "@/lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const grid = input.trim().split("\n").map((l) => l.split(""));
  let direction = (input.match(/[\^>v<]/g) || [])[0];
  if (direction == null) throw new Error("Could not find initial direction");
  const guard: { y: number; x: number } = { y: 0, x: 0 };
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const col = row[x];
      if (col === direction) {
        guard.y = y;
        guard.x = x;
        grid[y][x] = "X";
        break;
      }
    }
  }

  let moved = 0;
  let turned = 0;
  while (
    (guard.y >= 0 && guard.y < grid.length) &&
    (guard.x >= 0 && guard.x < grid[0].length)
  ) {
    debug(`moved ${moved}, turned ${turned}`);
    let { y, x } = guard;
    switch (direction) {
      case "^":
        y--;
        break;
      case ">":
        x++;
        break;
      case "v":
        y++;
        break;
      case "<":
        x--;
    }

    const nextPoint = grid[y]?.[x];
    if (nextPoint === "#") {
      turned++;
      switch (direction) {
        case "^":
          direction = ">";
          break;
        case ">":
          direction = "v";
          break;
        case "v":
          direction = "<";
          break;
        case "<":
          direction = "^";
      }
    } else {
      moved++;
      guard.y = y;
      guard.x = x;
      if ((y >= 0 && y < grid.length) && (x >= 0 && x < grid[0].length)) {
        grid[y][x] = "X";
      }
    }
  }

  debug("moved:");
  debug(moved);

  debug("turned:");
  debug(turned);

  debug("Done.");
  answer(
    grid.reduce(
      (total, row) =>
        row.reduce(
          (rowTotal, col) => col === "X" ? rowTotal + 1 : rowTotal,
          total,
        ),
      0,
    ),
  );
};
