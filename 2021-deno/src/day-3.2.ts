import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  const input = await loadInput();
  const rates = input.split("\n").filter((x) => x);

  debug(`Total rates: ${rates.length}`);

  function reduceReports(
    reports: string[],
    columnBitToKeepFn: (zeroCount: number, oneCount: number) => "0" | "1",
  ) {
    let _reports = [...reports];
    let column = 0;
    do {
      let zeroCount = 0;
      let oneCount = 0;

      for (let row = 0; row < _reports.length; row++) {
        const columnBit = _reports[row][column];

        if (columnBit === "0") zeroCount++;
        if (columnBit === "1") oneCount++;
      }

      let bitToKeep = columnBitToKeepFn(zeroCount, oneCount);
      _reports = _reports.filter((r) => r[column] === bitToKeep);

      if (_reports.length > 1) column++;
    } while (_reports.length > 1);

    return _reports[0];
  }

  const oxygenReport = reduceReports(
    rates,
    (zeroCount, oneCount) => oneCount >= zeroCount ? "1" : "0",
  );
  const co2ScrubberReport = reduceReports(
    rates,
    (zeroCount, oneCount) => zeroCount <= oneCount ? "0" : "1",
  );

  debug(`
     oxygenReport: ${oxygenReport}
co2ScrubberReport: ${co2ScrubberReport}
`);

  answer(parseInt(oxygenReport, 2) * parseInt(co2ScrubberReport, 2));
};
