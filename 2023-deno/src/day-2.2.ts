import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const games = input.split("\n").filter((x) => x);

  debug(`Total games: ${games.length}`);

  const gameStats = games.map((game) => {
    const gameId = parseInt(game.match(/^Game (\d+):/)![1]);
    const upperLimits = game.match(/^Game \d+: (.*)/)![1]
      .split("; ")
      .map((draw) =>
        draw
          .split(", ")
          .map((ball) => {
            const color = ball.match(/(red|green|blue)/)![0] as
              | "red"
              | "green"
              | "blue";
            const amount = parseInt(ball.match(/(\d+)/)![0]);
            return { color, amount };
          })
          .reduce((draws, draw) => {
            if (draw.amount > draws[draw.color]) {
              draws[draw.color] = draw.amount;
            }
            return draws;
          }, { red: 0, green: 0, blue: 0 })
      )
      .reduce((upperLimits, draw) => {
        keys(upperLimits).forEach((color) => {
          upperLimits[color] = draw[color] > upperLimits[color]
            ? draw[color]
            : upperLimits[color];
        });
        return upperLimits;
      }, { red: 0, green: 0, blue: 0 });

    return {
      id: gameId,
      upperLimits: upperLimits,
    };
  });

  const total = gameStats.reduce((total, { id, upperLimits }) => {
    total.added = total.added +
      (upperLimits.red * upperLimits.green * upperLimits.blue);
    total.incr++;
    return total;
  }, { added: 0, incr: 0 });
  debug(`Processed: ${total.incr}`);

  debug(`Done.`);
  answer(total.added);
};

// deno-lint-ignore ban-types
function keys<T extends {}>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}
