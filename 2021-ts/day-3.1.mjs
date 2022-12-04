import { readFileSync } from 'fs'

const input = readFileSync('./io/day-3.txt', { encoding: 'utf-8' });
const reports = input.split('\n');

let gammaRate = [];
for (let column = 0; column < reports[0].length; column++) {
  let zero = 0;
  let one = 0;

  for (let row = 0; row < reports.length; row++) {
    const columnBit = reports[row][column];
    if (columnBit === '0')
      zero++;
    if (columnBit === '1')
      one++;
  }

  gammaRate.push(zero > one ? '0' : '1');
}
const gammaRateDec = parseInt(gammaRate.join(''), 2)
const epsilonRateDec = parseInt(gammaRate.map(b => (1 - b).toString()).join(''), 2)

console.log(`
     gammaRate: ${gammaRate.join('')}
     gammaRateDec: ${gammaRateDec}
   epsilonRate: ${gammaRate.map(b => (1 - b).toString()).join('')}
   epsilonRateDec: ${epsilonRateDec}
   
         G * E: ${gammaRateDec * epsilonRateDec}
`);
