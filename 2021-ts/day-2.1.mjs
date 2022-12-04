import { readFileSync } from 'fs'

const input = readFileSync('./io/day-2.txt', { encoding: 'utf-8' });
const commands = input.split('\n');

const matcher = /^([a-z]+)\s([0-9]+)$/
let horizontalTotal = 0;
let depthTotal = 0;
for (let i = 0; i < commands.length; i++) {
  const command = commands[i];
  if (!command) continue;

  const [_, direction, distanceStr] = command.match(matcher);
  const distance = parseInt(distanceStr);

  switch (direction) {
    case 'forward':
      horizontalTotal += distance;
      break;
    case 'down':
      depthTotal += distance;
      break;
    case 'up':
      depthTotal -= distance;
      break;
  }
}

console.log(`
Horizontal: ${horizontalTotal}
     Depth: ${depthTotal}
     H * D: ${horizontalTotal * depthTotal}
`);
