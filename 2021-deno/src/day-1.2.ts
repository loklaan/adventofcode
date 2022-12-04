import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  const input = await loadInput();
  const depths = input.split("\n").filter((x) => x).map((n) => parseInt(n));

  debug(`Total depths: ${depths.length}`);

  const WINDOW_LENGTH = 3;
  let depthIncreases = 0;
  for (let i = 0; i < depths.length; i++) {
    const firstWindowStart = i - (WINDOW_LENGTH - 1) - 1;
    const secondWindowStart = i - (WINDOW_LENGTH - 1);

    if (
      // The start of the first window should be within the depth range
      firstWindowStart < 0 ||
      secondWindowStart + WINDOW_LENGTH >= depths.length
    ) {
      continue;
    }

    let firstWindowSum = 0;
    let secondWindowSum = 0;
    const debug = {
      first: [] as number[],
      second: [] as number[],
    };
    for (
      let windowPosition = 0;
      windowPosition < WINDOW_LENGTH;
      windowPosition++
    ) {
      debug.first.push(depths[firstWindowStart + windowPosition]);
      debug.second.push(depths[secondWindowStart + windowPosition]);

      firstWindowSum += depths[firstWindowStart + windowPosition];
      secondWindowSum += depths[secondWindowStart + windowPosition];
    }
    if (secondWindowSum > firstWindowSum) {
      depthIncreases++;
    }
  }

  answer(depthIncreases);
};
