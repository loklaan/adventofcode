import { Solution } from "../lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const gameCards = input.split("\n").map((l) => l.trim()).filter((x) => x);
  const [, winningNumbersLength, ownNumbersLength] = gameCards[0]
    .split(/[|:]/)
    .map((str) =>
      str
        .trim()
        .split(/ +/)
        .length
    );

  debug(`
  Scratchcards:  ${gameCards.length}
  Winning No.:   ${winningNumbersLength}
  Own No.:       ${ownNumbersLength}`);

  let totalScratchCardsPoints = 0;
  for (
    let gameCardIndex = 0;
    gameCardIndex < gameCards.length;
    gameCardIndex++
  ) {
    const gameCard = gameCards[gameCardIndex];
    const [, winningNumbers, ownNumbers] = gameCard
      .split(/[|:]/)
      .map((str) =>
        str
          .trim()
          .split(/ +/)
          .map((num) => parseInt(num))
      );
    const pointsFromMatching = winningNumbers.reduce(
      (totalPoints, winningNumber) => {
        if (ownNumbers.includes(winningNumber)) {
          return totalPoints === 0 ? 1 : (totalPoints * 2);
        }
        return totalPoints;
      },
      0,
    );
    totalScratchCardsPoints += pointsFromMatching;
  }

  debug("Done.");
  answer(totalScratchCardsPoints);
};
