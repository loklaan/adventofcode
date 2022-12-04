import { readFileSync } from 'fs'

const input = readFileSync('./io/day-3.txt', { encoding: 'utf-8' });
const reports = input.split('\n');

function reduceReports (reports, columnBitToKeep) {
  let _reports = [...reports]
  console.log('--')
  let column = 0;
  do  {
    let zeroCount = 0;
    let oneCount = 0;

    for (let row = 0; row < _reports.length; row++) {
      const columnBit = _reports[row][column];

      if (columnBit === '0')
        zeroCount++;
      if (columnBit === '1')
        oneCount++;
    }

    let bitToKeep = columnBitToKeep(zeroCount, oneCount);
    _reports = _reports.filter(r => r[column] === bitToKeep);
    console.log('column ' + column + ': reports=' + _reports.length);
    // console.log(`   zeroCount: ${zeroCount}`)
    if (_reports.length < 10) console.log(`   _reports: ${_reports}`)
    // console.log(`    oneCount: ${oneCount}`)
    console.log(`   bitToKeep: ${bitToKeep}`)

    if (_reports.length > 1)
      column++;
  } while (_reports.length > 1);

  console.log('Found at column ' + column);

  return _reports[0]
}

const oxygenReport = reduceReports(
  reports,
  (zeroCount, oneCount) =>
    (oneCount >= zeroCount ? '1' : '0')
)
const co2ScrubberReport = reduceReports(
  reports,
  (zeroCount, oneCount) =>
    (zeroCount <= oneCount ? '0' : '1')
)

console.log(`
     oxygenReport: ${oxygenReport}
co2ScrubberReport: ${co2ScrubberReport}

           answer: ${parseInt(oxygenReport, 2) * parseInt(co2ScrubberReport, 2) }
`);
