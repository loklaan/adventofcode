import { Solution } from "../lib/cli.ts";

const FACES_DESC = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

const PAIRINGS_DESC = [
  "5",
  "4:1",
  "3:2",
  "3:1:1",
  "2:2:1",
  "2:1:1:1",
  "1:1:1:1:1",
];

const handToPairing = (hand: string) => {
  const faceCount = hand
    .split("")
    .reduce((accum, face) => {
      accum[face] = (accum[face] || 0) + 1;
      return accum;
    }, {} as Record<string, number>);
  return Object.keys(faceCount).map((face) => faceCount[face]).sort().reverse()
    .join(":");
};

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const list = input.split("\n").map((l) => l.trim()).filter((x) => x);

  debug(`Hands & bids: ${list.length}`);

  const sortedHands = list
    .map((entry) => {
      const [hand, bid] = entry.split(" ");
      return { hand, bid: parseInt(bid), pairing: handToPairing(hand) };
    })
    .sort((a, b) => {
      if (a.pairing === b.pairing) {
        return a.hand.split("").reduce((relSort, aFace, index) => {
          const bFace = b.hand[index];
          if (relSort === 0 && aFace !== bFace) {
            return FACES_DESC.indexOf(aFace) > FACES_DESC.indexOf(bFace)
              ? -1
              : 1;
          }

          return relSort;
        }, 0);
      } else {
        return PAIRINGS_DESC.indexOf(a.pairing) >
            PAIRINGS_DESC.indexOf(b.pairing)
          ? -1
          : 1;
      }
    });
  const winnings = sortedHands.reduce(
    (total, { hand, pairing, bid }, index) => {
      return (bid * (index + 1)) + total;
    },
    0,
  );

  debug("Done.");
  answer(winnings);
};
