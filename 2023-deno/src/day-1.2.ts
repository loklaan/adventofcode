import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  const input = await loadInput();
  const encoded = input.split("\n").filter((x) => x);

  debug(
    `Total encoded calibrations (numbers and number words): ${encoded.length}`,
  );

  function reverse(str: string) {
    return str.split("").reverse().join("");
  }

  const digitWordMap = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  } as const;
  const digitalWordMapReversed = Object.fromEntries(
    Object.entries(digitWordMap).map(([key, val]) =>
      [reverse(key), val] as const
    ),
  );

  const firstRegex = new RegExp(
    `([0-9]|${Object.keys(digitWordMap).join("|")})`,
  );
  const secondRegex = new RegExp(
    `([0-9]|${Object.keys(digitalWordMapReversed).join("|")})`,
  );

  const totalDecodedCalibrations = encoded.reduce(
    (ctx, encodedCalibration) => {
      let [firstDigit] = encodedCalibration.match(
        firstRegex,
      )!;
      if (firstDigit.length > 1) {
        firstDigit = digitWordMap[firstDigit as keyof typeof digitWordMap];
      }
      let [lastDigit] = reverse(encodedCalibration).match(
        secondRegex,
      )!;
      if (lastDigit.length > 1) {
        lastDigit = digitalWordMapReversed[
          lastDigit as keyof typeof digitalWordMapReversed
        ];
      }
      const decodedCalibration = parseInt(`${firstDigit}${lastDigit}`);
      return ctx + decodedCalibration;
    },
    0,
  );

  debug(`Done.`);
  answer(totalDecodedCalibrations);
};
