import { Solution } from "../lib/cli.ts";

const BREAKER = 500000;

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const [instructionsLine, ...elementLines] = input.split("\n").map((l) =>
    l.trim()
  ).filter((x) => x);

  const instructions = instructionsLine.split("") as ("L" | "R")[];
  const lookup = Object.fromEntries(elementLines.map((l) => {
    const [, instruction, L, R] = Array.from(
      l.match(/^([0-9A-Z]+) = \(([0-9A-Z]+), ([0-9A-Z]+)\)$/)!,
    );
    return [instruction, { L, R } as const];
  }));

  debug(`Instructions: ${instructions.length}`);
  debug(`Nodes:        ${(Object.keys(lookup)).length}`);

  const startingNodes = Object
    .keys(lookup)
    .filter((singleLookup) => singleLookup.endsWith("A"));
  const endingNodes = Object
    .keys(lookup)
    .filter((singleLookup) => singleLookup.endsWith("Z"));
  debug(`Entry Nodes:  ${startingNodes.length}`);
  debug(`  ${startingNodes.join(", ")}`);
  debug(`  ${endingNodes.join(", ")}`);

  const nextNodes = startingNodes.map((node) => ({
    path: [{ node, dir: "" }],
    node,
    i: 0,
  }));
  let i = 0;
  do {
    const dir = instructions[i % instructions.length];
    nextNodes.forEach((curNode) => {
      const nextNode = lookup[curNode.node][dir];
      if (curNode.i === 0) {
        curNode.path.push({ node: nextNode, dir });
        if (endingNodes.includes(nextNode)) {
          debug(`Path found (@${i}): ${curNode.path[0].node} - > ${nextNode}`);
          // Done for this node.
          curNode.node = nextNode;
          curNode.i = i;
        } else {
          // Cont. iterating.
          curNode.node = nextNode;
        }
      }
    });
    i++;
  } while (!nextNodes.every((n) => n.i !== 0));

  const gcd = (a: number, b: number): number => b == 0 ? a : gcd(b, a % b);
  const lcm = (a: number, b: number) => a / gcd(a, b) * b;
  const lcmAll = (ns: number[]) => ns.reduce(lcm, 1);

  const lcmForNodePaths = lcmAll(nextNodes.map((n) => n.i + 1));
  debug(
    `The LCM for ${
      nextNodes.map((n) => n.i + 1).join(" and ")
    } is ${lcmForNodePaths}.`,
  );

  debug("Done.");
  answer(lcmForNodePaths);
};
