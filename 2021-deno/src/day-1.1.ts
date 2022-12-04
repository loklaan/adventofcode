import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  const input = await loadInput();
  const depths = input.split("\n").filter((x) => x);

  debug(`Total depths: ${depths.length}`);

  const { depthIncreases } = depths.reduce(
    (ctx, depthStr) => {
      const depth = parseInt(depthStr);
      if (ctx.prevDepth && depth > ctx.prevDepth) ctx.depthIncreases++;
      ctx.prevDepth = depth;
      return ctx;
    },
    { prevDepth: undefined, depthIncreases: 0 } as {
      prevDepth: number | undefined;
      depthIncreases: number;
    },
  );

  answer(depthIncreases);
};
