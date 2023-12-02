import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  const input = await loadInput();
  const encoded = input.split("\n").filter((x) => x);

  debug(`Total encoded calibrations (numbers only): ${encoded.length}`);

  const totalDecodedCalibrations = encoded.reduce(
    (ctx, encodedCalibration) => {
      const firstDigit = encodedCalibration.replace(
        /^[a-zA-Z]*([0-9]).*/g,
        "$1",
      );
      const lastDigit = encodedCalibration.replace(
        /.*([0-9])[a-zA-Z]*$/g,
        "$1",
      );
      const decodedCalibration = parseInt(`${firstDigit}${lastDigit}`);
      return ctx + decodedCalibration;
    },
    0,
  );

  debug(`Done.`);
  answer(totalDecodedCalibrations);
};
