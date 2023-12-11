import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const [seedsLine, , ...otherLines] = input.split("\n").map((l) => l.trim())
    .filter((x) => x);
  const seedRanges = Array.from(seedsLine.split(":")[1].matchAll(/\d+/g)).reduce((accum, m, index, all) => {
    if (index % 2 === 0) {
      const start = parseInt(m[0]);
      const range = parseInt(all[index + 1][0]);
      accum.push([start, range]);
    }
    return accum;
  }, [] as [number, number][]);
  debug(`Seed Ranges: ${seedRanges.length}`);

  let mapIndex = 0;
  const almanacMaps: Array<
    Array<{ source: number; destination: number; length: number }>
  > = [];
  for (let lineIndex = 0; lineIndex < otherLines.length; lineIndex++) {
    const line = otherLines[lineIndex];
    if (line.includes("map") || lineIndex === otherLines.length - 1) {
      // almanacMaps[mapIndex].sort((a, b) => a.source > b.source ? 1 : -1);
      mapIndex++;
    } else {
      const map = almanacMaps[mapIndex] || [] as typeof almanacMaps[number];
      const [destination, source, length] = Array.from(line.matchAll(/\d+/g));
      map.push({
        destination: parseInt(destination[0]),
        source: parseInt(source[0]),
        length: parseInt(length[0]),
      });
      almanacMaps[mapIndex] = map;
    }
  }

  let lowestSeedLocation = 9999999999999;
  for (let i = 0; i < seedRanges.length; i++) {
    const [start, range] = seedRanges[i];
    debug(`Range ${i + 1}, seeds from      ${start}\n                              to ${start + range - 1}`);
    for (let j = 0; j < range; j++) {
      const seed = start + j;
      // if (j % 1000000 === 0) {
      //   debug(`Range ${i + 1}, processing seed ${seed} of ${start + range - 1}... Current lowest: ${lowestSeedLocation}`);
      // }
      let lastVal = seed;
      for (const sourceToDestinationMap of almanacMaps) {
        const currentSource = lastVal;
        const mapping = sourceToDestinationMap.find(
          ({ source: sourceStart, destination: destinationStart, length }) => {
            const destinationEnd = destinationStart + length - 1;
            const diff = destinationStart - sourceStart;
            const mappedDestination = lastVal + diff;
            return mappedDestination >= destinationStart &&
              mappedDestination <= destinationEnd;
          },
        );

        let destination = currentSource;
        if (mapping) {
          destination = currentSource + (mapping.destination - mapping.source);
        }

        // Tick over, for next mapping
        lastVal = destination;
      }
      const location = lastVal;
      if (lowestSeedLocation > location) {
        lowestSeedLocation = location;
      }
    }
  }

  debug("Done.");
  answer(lowestSeedLocation);
};
