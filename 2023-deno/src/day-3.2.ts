import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const inputS = input.split("\n").join("").trim();
  const rawSchematic = input.split("\n").map((l) => l.trim()).filter((x) => x);

  debug(`Schematic size: ${rawSchematic[0].length} x ${rawSchematic.length}`);

  const ll = rawSchematic[0].length;
  const numRegex = /([0-9]+)/gi;
  const matches = inputS.matchAll(numRegex)!;
  const gearMap = new Map<number, number[]>();
  for (const match of matches) {
    if (match.index != null) {
      const numLength = match[0].length;
      const indexUp = match.index - ll;
      const indexDown = match.index + ll;
      const charAt = (index: number) =>
        inputS[index] != null && inputS[index].trim().length > 0
          ? inputS[index]
          : ".";
      // deno-fmt-ignore
      const indices = [
        indexUp - 1, ...Array(numLength + 1).fill(null).map((_, i) => indexUp + i),
        match.index - 1, ...Array(numLength).fill(null).map((_, i) => match.index! + i), match.index + numLength,
        indexDown - 1, ...Array(numLength + 1).fill(null).map((_, i) => indexDown + i),
      ]
      const gearIndex = indices.find((index) => {
        return charAt(index) === "*";
      });
      if (gearIndex != null) {
        const matching = gearMap.get(gearIndex) || [];
        matching.push(parseInt(match[0]));
        gearMap.set(gearIndex, matching);
      }
    }
  }
  const total = Array
    .from(gearMap.entries())
    .reduce((gearRatioTotal: number, [, matches]) => {
      if (matches.length === 2) {
        const gearRatio = matches[0] * matches[1];
        return gearRatioTotal + gearRatio;
      }
      return gearRatioTotal;
    }, 0);
  debug("Done.");
  answer(total);
};
