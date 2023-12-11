import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const inputS = input.split("\n").join("").trim();
  const rawSchematic = input.split("\n").map((l) => l.trim()).filter((x) => x);

  debug(`Schematic size: ${rawSchematic[0].length} x ${rawSchematic.length}`);

  const ll = rawSchematic[0].length;
  const numRegex = /([0-9]+)/gi;
  const partRegex = /[^.0123456789]/g;
  const matches = inputS.matchAll(numRegex)!;
  let total = 0;
  for (const match of matches) {
    if (match.index != null) {
      const numLength = match[0].length;
      const indexUp = match.index - ll;
      const indexDown = match.index + ll;
      const charAt = (index: number) =>
        inputS[index] != null && inputS[index].trim().length > 0
          ? inputS[index]
          : ".";
      const l1 = `${charAt(indexUp - 1)}${
        Array(numLength + 1).fill(null).map((_, i) => charAt(indexUp + i)).join(
          "",
        )
      }`;
      const l2 = `${charAt(match.index - 1)}${match[0]}${
        charAt(match.index + numLength)
      }`;
      const l3 = `${charAt(indexDown - 1)}${
        Array(numLength + 1).fill(null).map((_, i) => charAt(indexDown + i))
          .join("")
      }`;
      const allLines = l1 + l2 + l3;
      if (allLines.match(partRegex)) {
        total += parseInt(match[0]);
      }
    }
  }
  debug("Done.");
  answer(total);
};
