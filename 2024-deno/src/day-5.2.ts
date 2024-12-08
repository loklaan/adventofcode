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
  const pagesAllowedAfter: Partial<Record<number, number[]>> = {};
  for (const [pageBefore, pageAfter] of rules) {
    pagesAllowedAfter[pageBefore] = pagesAllowedAfter[pageBefore] ?? [];
    pagesAllowedAfter[pageBefore].push(pageAfter);
  }
  debug("pagesAllowedAfter:");
  debug(pagesAllowedAfter);
  const pagesAllowedBefore: Partial<Record<number, number[]>> = {};
  for (const [pageBefore, pageAfter] of rules) {
    pagesAllowedBefore[pageAfter] = pagesAllowedBefore[pageAfter] ?? [];
    pagesAllowedBefore[pageAfter].push(pageBefore);
  }
  debug("pagesAllowedBefore:");
  debug(pagesAllowedBefore);
  const updates = updatesInput.trim().split("\n").map((l) =>
    l.split(",").map((n) => parseInt(n))
  );
  debug("updates:");
  debug(updates);
  const invalidUpdates = updates.filter((pages) => {
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const remainingPages = pages.slice(i + 1);
      for (const remainingPage of remainingPages) {
        const pagesAllowedBeforeRemainingPage =
          pagesAllowedBefore[remainingPage];
        if (pagesAllowedBeforeRemainingPage == null) {
          const disallowedAfterPages = pagesAllowedAfter[remainingPage];
          if (disallowedAfterPages == null) {
            throw new Error(`Ergh: ${remainingPage}`);
          } else if (disallowedAfterPages.includes(page)) {
            return true;
          }
        } else if (!pagesAllowedBeforeRemainingPage.includes(page)) {
          return true;
        }
      }
    }
    return false;
  });
  debug("invalidUpdates:");
  debug("\n" + invalidUpdates.join("\n"));

  const fixedUpdates = invalidUpdates.map((pages) => {
    return pages.toSorted((a, b) =>
      pagesAllowedBefore[a]?.includes(b) ? 1 : -1
    );
  });
  debug("fixedUpdates:");
  debug("\n" + fixedUpdates.join("\n"));

  const total = fixedUpdates.reduce((total, pages) => {
    const page = pages[(pages.length - 1) / 2];
    debug(`Adding ${page}`);
    return total + page;
  }, 0);

  answer(total);
};
