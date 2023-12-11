import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const lines = input.split("\n").map((l) => l.trim()).filter((x) => x);

  const racesTimes = Array.from(lines[0].matchAll(/\d+/g)).map((m) => m[0]);
  const racesDistances = Array.from(lines[1].matchAll(/\d+/g)).map((m) => m[0]);
  const races = racesTimes.map((
    t,
    i,
  ) => ({
    time: parseInt(t),
    distance: parseInt(racesDistances[i]),
  }));

  debug(`Races: ${races.length}`);

  const RATE = 1;
  const racesWon = races.map(({ time, distance: bestDistance }, i) => {
    let numberOfTimesBeat = 0;
    for (let pressForMs = 0; pressForMs < time; pressForMs++) {
      const attemptDistance = pressForMs * RATE * (time - pressForMs);
      if (attemptDistance > bestDistance) {
        numberOfTimesBeat += 1;
      }
    }
    return numberOfTimesBeat;
  });

  debug("Done.");
  answer(racesWon.reduce((total, numberOfTimesBeat) => {
    return total * numberOfTimesBeat;
  }, 1));
};
