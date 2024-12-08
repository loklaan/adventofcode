import { Solution } from "@/lib/cli.ts";

type RoutePoint = { y: number; x: number; d: string };

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const grid = input.trim().split("\n").map((l) => l.split(""));
  const { guardRoute } = getGuardRoute(grid);

  const modifiedRoutes: {
    modifiedPoint: RoutePoint;
    route: { looped: boolean; guardRoute: RoutePoint[] };
  }[] = [];
  for (let r = 0; r < guardRoute.length; r++) {
    const path = guardRoute[r];
    const nextPoint = grid[path.y][path.x];
    if (nextPoint === ".") {
      grid[path.y][path.x] = "#";
      modifiedRoutes.push({
        modifiedPoint: { ...path },
        route: getGuardRoute(grid),
      });
      grid[path.y][path.x] = ".";
    }
  }

  debug(`All possible modified routes: ${modifiedRoutes.length}`);
  const validModifiedRoutes = modifiedRoutes.filter(
    ({ route, modifiedPoint }) =>
      route.looped &&
      modifiedRoutes.filter(({ modifiedPoint: modifiedPoint2 }) =>
          modifiedPoint.x === modifiedPoint2.x &&
          modifiedPoint.y === modifiedPoint2.y
        ).length === 1,
  );
  debug(
    `All modified routes that are valid: ${validModifiedRoutes.length}`,
  );
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

function getGuardRoute(
  grid: string[][],
): { looped: boolean; guardRoute: RoutePoint[] } {
  const guard: RoutePoint = { y: 0, x: 0, d: "" };
  const guardRoute: RoutePoint[] = [];
  const guardRouteTurnsOnly: RoutePoint[] = [];

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const col = row[x];
      const maybeDirection = col.match(/[\^>v<]/)?.[0];
      if (maybeDirection) {
        guard.d = maybeDirection;
        guard.y = y;
        guard.x = x;
        guardRoute.push({ ...guard });
        break;
      }
    }
  }

  while (
    (guard.y >= 0 && guard.y < grid.length) &&
    (guard.x >= 0 && guard.x < grid[0].length)
  ) {
    let { y: nextY, x: nextX } = guard;
    switch (guard.d) {
      case "^":
        nextY--;
        break;
      case ">":
        nextX++;
        break;
      case "v":
        nextY++;
        break;
      case "<":
        nextX--;
    }

    const nextPoint = grid[nextY]?.[nextX];
    if (nextPoint === "#") {
      switch (guard.d) {
        case "^":
          guard.d = ">";
          break;
        case ">":
          guard.d = "v";
          break;
        case "v":
          guard.d = "<";
          break;
        case "<":
          guard.d = "^";
      }
      const newTurn = { y: guard.y, x: guard.x, d: guard.d };
      if (
        guardRouteTurnsOnly.toReversed().some((priorTurn) =>
          priorTurn.x === newTurn.x && priorTurn.y === newTurn.y &&
          priorTurn.d === newTurn.d
        )
      ) {
        guardRouteTurnsOnly.push(newTurn);
        return { looped: true, guardRoute: guardRoute };
      } else {
        guardRouteTurnsOnly.push(newTurn);
      }
    } else {
      guard.y = nextY;
      guard.x = nextX;
      if (
        (nextY >= 0 && nextY < grid.length) &&
        (nextX >= 0 && nextX < grid[0].length)
      ) {
        guardRoute.push({ ...guard });
      }
    }
  }

  return { looped: false, guardRoute };
}
