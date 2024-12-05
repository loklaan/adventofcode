import { Solution } from "@/lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const [rulesInput, updatesInput] = input.trim().split("\n\n");
  const rules = rulesInput.trim().split("\n").map((l) =>
    l.split("|").map((n) => parseInt(n))
  );
  debug(`rules:`);
  debug(rules);
  const rulesRecord: Partial<Record<number, number[]>> = {};
  for (const [pageBefore, pageAfter] of rules) {
    rulesRecord[pageBefore] = rulesRecord[pageBefore] ?? [];
    rulesRecord[pageBefore].push(pageAfter);
  }
  debug("rulesRecord:");
  debug(rulesRecord);
  const inverseRulesRecord: Partial<Record<number, number[]>> = {};
  for (const [pageBefore, pageAfter] of rules) {
    inverseRulesRecord[pageAfter] = inverseRulesRecord[pageAfter] ?? [];
    inverseRulesRecord[pageAfter].push(pageBefore);
  }
  debug("inverseRulesRecord:");
  debug(inverseRulesRecord);
  const updates = updatesInput.trim().split("\n").map((l) =>
    l.split(",").map((n) => parseInt(n))
  );
  debug("updates:");
  debug(updates);
  const validUpdates = updates.filter((pages) => {
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const remainingPages = pages.slice(i + 1);
      for (const remainingPage of remainingPages) {
        const allowedBeforePages = inverseRulesRecord[remainingPage];
        if (allowedBeforePages == null) {
          const disallowedAfterPages = rulesRecord[remainingPage];
          if (disallowedAfterPages == null) {
            throw new Error(`Ergh: ${remainingPage}`);
          } else if (disallowedAfterPages.includes(page)) {
            return false;
          }
        } else if (!allowedBeforePages.includes(page)) {
          return false;
        }
      }
    }
    return true;
  });
  debug("validUpdates:");
  debug("\n" + validUpdates.join("\n"));

  const total = validUpdates.reduce((total, pages) => {
    const page = pages[(pages.length - 1) / 2];
    debug(`Adding ${page}`);
    return total + page;
  }, 0);

  answer(total);
};
