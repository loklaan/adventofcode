import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const lines = input.split("\n").map((l) => l.trim()).filter((x) => x);
  const histories = lines.map((l) => l.split(/ +/g).map((n) => parseInt(n)));

  debug(`Sequences: ${histories.length}`);

  const isBalanced = (sequences: number[][]): boolean => {
    // Haven't started.
    if (sequences.length > 1) {
      return false;
    }
    // Last sequence isn't finished.
    const lastSequence = sequences[sequences.length - 1];
    const secondLastSequence = sequences[sequences.length - 2];
    if (
      lastSequence.length ===
        (secondLastSequence.length - 1)
    ) {
      return false;
    }

    // Check that the last sequence is all 0's (balanced).
    return lastSequence.every((n) => n === 0);
  };
  const total = histories.reduce((total, history) => {
    const sequences: number[][] = [];

    for (let i = 0; i < history.length; i++) {
      if (i === 0) {
        sequences.push(history);
        continue;
      }
      const lastSequence = sequences[i-1];
      const sequence: number[] = [];
      const sequenceLength = lastSequence.length - 1;
      sequences.push(sequence);

      for (let j = 0; j < sequenceLength; j++) {
        const a = lastSequence[j];
        const b = lastSequence[j+1];
        sequence.push(Math.abs(a-b));
      }
      if (sequence.every((n) => n === 0)) {
        break;
      }
    }

    const solvedSequences = sequences.reverse().map((sequence, i, all) => {
      if (i === 0) {
        return [...sequence, 0];
      }
      const lastSequence = all[i-1];
      const lastValFromLastSequence = lastSequence[lastSequence.length - 1];
      const lastVal = sequence[sequence.length - 1];
      return [...sequence, lastVal + lastValFromLastSequence]
    }).reverse();

    const l = solvedSequences[0].length;
    debug(`\n${solvedSequences.map((s, i) => {
      return `${s.join(' '.repeat(Math.floor((l - s.length))))}`;
    }).join('\n')}`);

    const nextHistory = solvedSequences[0];
    return total +  nextHistory[nextHistory.length - 1];
  }, 0);

  debug("Done.");
  answer(total);
};
