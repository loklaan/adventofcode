import { Solution } from "../lib/cli.ts";

const BREAKER = 100000;

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const [instructionsLine, ...elementLines] = input.split("\n").map((l) =>
    l.trim()
  ).filter((x) => x);

  const instructions = instructionsLine.split("");
  const lookup = Object.fromEntries(elementLines.map((l) => {
    const [, instruction, left, right] = Array.from(
      l.match(/^([A-Z]+) = \(([A-Z]+), ([A-Z]+)\)$/)!,
    );
    return [instruction, { left, right } as const];
  }));

  debug(`Instructions: ${instructions.length}`);
  debug(`Nodes:        ${(Object.keys(lookup)).length}`);

  let nextLookup = "AAA";
  let iterations = 0;
  while (nextLookup !== "ZZZ") {
    if (iterations > BREAKER) {
      break;
    }

    const instructionIndex = iterations % instructions.length;
    const instruction = instructions[instructionIndex] === "R"
      ? "right" as const
      : "left" as const;
    nextLookup = lookup[nextLookup][instruction];

    iterations++;
  }

  debug("Done.");
  answer(iterations);
};
