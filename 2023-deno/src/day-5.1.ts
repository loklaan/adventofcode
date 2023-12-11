import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const [seedsLine, , ...otherLines] = input.split("\n").map((l) => l.trim())
    .filter((x) => x);
  const seeds = Array.from(seedsLine.split(":")[1].matchAll(/\d+/g)).map((m) =>
    parseInt(m[0])
  );
  debug(`Seeds: ${seeds.length}`);

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

  const seedJourneys: number[][] = [];
  const seedLocations = seeds.map((seed) => {
    const journey: number[] = [seed];
    seedJourneys.push(journey);
    return almanacMaps.reduce((source, sourceToDestinationMap) => {
      const mapping = sourceToDestinationMap.find(
        ({ source: sourceStart, destination: destinationStart, length }) => {
          const destinationEnd = destinationStart + length - 1;
          const diff = destinationStart - sourceStart;
          const mappedDestination = source + diff;
          return mappedDestination >= destinationStart &&
            mappedDestination <= destinationEnd;
        },
      );

      let destination = source;
      if (mapping) {
        destination = source + (mapping.destination - mapping.source);
      }
      journey.push(destination);
      return destination;
    }, seed);
  }).sort((a, b) => a > b ? 1 : -1);

  debug("Done.");
  answer(seedLocations[0]);
};
