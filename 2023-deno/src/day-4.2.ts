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

  type CardNumber = number;
  let gameMap = new Map<
    CardNumber,
    { copies: number; winning: number[]; own: number[] }
  >();
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
    gameMap.set(gameCardIndex, {
      copies: 1,
      winning: winningNumbers,
      own: ownNumbers,
    });
  }

  let totalPileOfCards = 0;
  for (const [gameCardIndex, { copies, winning, own }] of gameMap) {
    totalPileOfCards += copies;
    const wins = winning.filter((winningNumber) =>
      own.includes(winningNumber)
    ).length;
    for (let i = 0; i < wins; i++) {
      const wonGameCardIndex = gameCardIndex + (i + 1);
      const wonGameCard = gameMap.get(wonGameCardIndex);
      if (wonGameCard) {
        wonGameCard.copies += copies; // mutative
      }
    }
  }

  debug("Done.");
  answer(totalPileOfCards);
};
