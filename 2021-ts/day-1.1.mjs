import { readFileSync } from 'fs'

const input = readFileSync('./io/day1.txt', { encoding: 'utf-8' });

const { depthIncreases } = input.split('\n').reduce(
  (ctx, depthStr) => {
    const depth = parseInt(depthStr);
    if (ctx.prevDepth && depth > ctx.prevDepth)
      ctx.depthIncreases++;
    ctx.prevDepth = depth;
    return ctx;
  },
  { prevDepth: undefined, depthIncreases: 0 }
)

console.log(depthIncreases);
