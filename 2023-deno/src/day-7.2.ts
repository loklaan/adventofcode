import { Solution } from "../lib/cli.ts";

const FACES_DESC = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
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

const countsToPairing = (counts: Record<string, number>) =>
  Object.keys(counts)
    .map((face) => counts[face])
    .sort()
    .reverse()
    .join(":");
const handToPairing = (hand: string) => {
  const faceCount = hand
    .split("")
    .reduce((accum, face) => {
      accum[face] = accum[face] || 0;
      accum[face] += 1;
      return accum;
    }, {} as Record<string, number>);

  const hasJoker = typeof faceCount.J === "number";
  if (hasJoker) {
    const jokerCount = faceCount.J;
    delete faceCount.J;

    if (jokerCount === 5) {
      // JJJJJ > AAAAA
      faceCount["A"] = jokerCount;
    } else if (Object.keys(faceCount).every((face) => faceCount[face] === 1)) {
      // AQT2J > AQT2A
      // AQJ2J > AQA2A
      const favouredFace = Object.keys(faceCount).sort((a, b) =>
        FACES_DESC.indexOf(a) > FACES_DESC.indexOf(b) ? -1 : 1
      )[0];
      faceCount[favouredFace] += jokerCount;
    } else {
      // Everything else...
      const favouredFace =
        Object.keys(faceCount).reduce((highestFace, face) => {
          const count = faceCount[face];
          if (count > highestFace.count) {
            highestFace.face = face;
            highestFace.count = count;
          }
          return highestFace;
        }, { face: "", count: 0 }).face;
      faceCount[favouredFace] += jokerCount;
    }
  }

  return countsToPairing(faceCount);
};

const mapHand = (entry: string) => {
  const [hand, bid] = entry.split(" ");
  return { hand, bid: parseInt(bid), pairing: handToPairing(hand) };
};

type Hand = ReturnType<typeof mapHand>;

const sortHand = (a: Hand, b: Hand) => {
  if (a.pairing === b.pairing) {
    return a.hand.split("").reduce((relSort, aFace, index) => {
      const bFace = b.hand[index];
      if (relSort === 0 && aFace !== bFace) {
        return FACES_DESC.indexOf(aFace) > FACES_DESC.indexOf(bFace) ? -1 : 1;
      }

      return relSort;
    }, 0);
  } else {
    return PAIRINGS_DESC.indexOf(a.pairing) >
        PAIRINGS_DESC.indexOf(b.pairing)
      ? -1
      : 1;
  }
};

const addRank = (hand: Hand, index: number) => {
  return { ...hand, rank: index + 1 };
};

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const list = input.split("\n").map((l) => l.trim()).filter((x) => x);

  debug(`Hands & bids: ${list.length}`);

  const sortedHands = list
    .map(mapHand)
    .sort(sortHand)
    .map(addRank);
  const winnings = sortedHands.reduce(
    (total, { bid, rank }) => {
      return (bid * rank) + total;
    },
    0,
  );

  debug("Done.");
  answer(winnings);
};
