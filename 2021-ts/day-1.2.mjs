import { readFileSync } from 'fs'

const input = readFileSync('./io/day-1.txt', { encoding: 'utf-8' });
const depths = input.split('\n').map(n => parseInt(n));

const WINDOW_LENGTH = 3;
let depthIncreases = 0;
for (let i = 0; i < depths.length; i++) {
  const firstWindowStart = i - (WINDOW_LENGTH - 1) - 1;
  const secondWindowStart = i - (WINDOW_LENGTH - 1);

  if (
    // The start of the first window should be within the depth range
    firstWindowStart < 0 ||
    (secondWindowStart + WINDOW_LENGTH) >= depths.length
  ) {
    continue;
  }

  let firstWindowSum = 0;
  let secondWindowSum = 0;
  const debug = {
    first: [],
    second: [],
  }
  for (let windowPosition = 0; windowPosition < WINDOW_LENGTH; windowPosition++) {
    debug.first.push(depths[firstWindowStart + windowPosition]);
    debug.second.push(depths[secondWindowStart + windowPosition]);

    firstWindowSum += depths[firstWindowStart + windowPosition];
    secondWindowSum += depths[secondWindowStart + windowPosition];
  }
  console.log(`LINE: ${i} - INPUT ${depths[i]}.  F:${debug.first}(${firstWindowSum})  S:${debug.second}(${secondWindowSum})  ${secondWindowSum > firstWindowSum ? ' ♥' : ''}`)
  if (secondWindowSum > firstWindowSum) {
    depthIncreases++;
  }
}

console.log(depthIncreases);
