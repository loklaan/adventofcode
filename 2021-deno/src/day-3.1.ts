import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  const input = await loadInput();
  const rates = input.split("\n").filter((x) => x);

  debug(`Total rates: ${rates.length}`);

  let gammaRate = [];
  for (let column = 0; column < rates[0].length; column++) {
    let zero = 0;
    let one = 0;

    for (let row = 0; row < rates.length; row++) {
      const columnBit = rates[row][column];
      if (columnBit === "0") zero++;
      if (columnBit === "1") one++;
    }

    gammaRate.push(zero > one ? "0" : "1");
  }
  const gammaRateDec = parseInt(gammaRate.join(""), 2);
  const epsilonRateDec = parseInt(
    gammaRate.map((b) => (1 - parseInt(b)).toString()).join(""),
    2,
  );

  debug(`
      gammaRate: ${gammaRate.join("")}
   gammaRateDec: ${gammaRateDec}
    epsilonRate: ${gammaRate.map((b) => (1 - parseInt(b)).toString()).join("")}
 epsilonRateDec: ${epsilonRateDec}
          G * E: ${gammaRateDec * epsilonRateDec}
`);

  answer(gammaRateDec * epsilonRateDec);
};
