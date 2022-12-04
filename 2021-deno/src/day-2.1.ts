import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  const input = await loadInput();
  const commands = input.split("\n").filter((x) => x);

  debug(`Total commands: ${commands.length}`);

  const matcher = /^([a-z]+)\s([0-9]+)$/;
  let horizontalTotal = 0;
  let depthTotal = 0;
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    if (!command) continue;

    const match = command.match(matcher);
    if (match == null) {
      console.error("Could not parse commands from input");
      Deno.exit(1);
    }

    const [_, direction, distanceStr] = match;
    const distance = parseInt(distanceStr);

    switch (direction) {
      case "forward":
        horizontalTotal += distance;
        break;
      case "down":
        depthTotal += distance;
        break;
      case "up":
        depthTotal -= distance;
        break;
    }
  }

  debug(`
  Horizontal: ${horizontalTotal}
       Depth: ${depthTotal}
       H * D: ${horizontalTotal * depthTotal}
`);

  answer(horizontalTotal * depthTotal);
};
