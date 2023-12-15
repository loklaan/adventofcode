#!/usr/bin/env -S deno run --allow-env --allow-run --allow-read

import { Command, ValidationError } from "x/cliffy/command/mod.ts";
import { BoxFormatter, Input, setupLogger, Solution } from "./lib/cli.ts";
import { Logger } from "std/log/logger.ts";
import * as color from "std/fmt/colors.ts";
import * as duration from "std/fmt/duration.ts";

if (import.meta.main) {
  await main();
}

export async function main() {
  const availablePuzzles = Array.from(Deno.readDirSync("src")).filter((entry) =>
    entry.name.match(/^day-(\d+\.\d+)\.ts$/)
  ).map((entry) => entry.name.replace(/^day-(\d+\.\d+)\.ts$/, "$1"))
    .sort();

  await new Command()
    .name("adventofcode")
    .description("Run puzzles for Advent Of Code 2023")
    .env("DEBUG=<enable:boolean>", "Enable debug output.")
    .arguments("[puzzle:string]")
    .option("-e,--example", "Input the example data, instead of the real data.")
    .option("-s,--spoilers", "Obscure the answer to avoid sharing spoilers.")
    .action(async (options, puzzle) => {
      const logger = setupLogger(!!options.debug);

      logger.debug(`Actioning command. Puzzle provided ${puzzle || "none"}`);

      /*
      |-------------------------------------------------------------------------------
      | Validate the chosen puzzle to run.
      */
      if (typeof puzzle === "string" && !availablePuzzles.includes(puzzle)) {
        logger.error(`"${puzzle}" not in [${availablePuzzles}]`);

        throw new ValidationError(
          `Provided puzzle "${puzzle}" is not available to run, try one of these next time: ${
            availablePuzzles.join(", ")
          }`,
        );
      }
      let confirmedPuzzle: string;
      if (typeof puzzle === "string") {
        confirmedPuzzle = puzzle;
      } else {
        logger.debug(`Prompting user for puzzle choice`);
        confirmedPuzzle = await Input.prompt({
          message: "Choose a puzzle to run",
          list: true,
          info: true,
          suggestions: availablePuzzles,
          hint: "Type a puzzle name",
          complete: (input, suggestion) => {
            return suggestion || input;
          },
        });
        if (!availablePuzzles.includes(confirmedPuzzle)) {
          throw new ValidationError(
            `Provided puzzle "${puzzle}" is not available to run, try one of these next time: ${
              availablePuzzles.join(", ")
            }`,
          );
        }
        logger.debug(`User selected "${confirmedPuzzle}"`);
      }
      const puzzleFile = `src/day-${confirmedPuzzle}.ts`;
      logger.debug(`Mapped selected puzzle to ${puzzleFile}`);

      /*
      |-------------------------------------------------------------------------------
      | Run the chosen puzzle
      */
      await runPuzzleSolution(logger, confirmedPuzzle, {
        spoilers: !!options.spoilers,
        example: !!options.example,
      });
    })
    .command(
      "all",
      new Command()
        .description("Run all puzzles sequentially.")
        .env("DEBUG=<enable:boolean>", "Enable debug output.")
        .arguments("")
        .option(
          "-e,--example",
          "Input the example data, instead of the real data.",
        )
        .option(
          "-s,--spoilers",
          "Obscure the answer to avoid sharing spoilers.",
        )
        .action(
          async (options) => {
            const logger = setupLogger(!!options.debug);

            logger.debug(`Actioning 'all' command.`);

            console.log(
              `\nRunning all available puzzles${
                options.spoilers
                  ? " " +
                    color.italic(
                      color.black(color.bgWhite(" in Spoiler-free Mode ")),
                    )
                  : ""
              }:\n\n${availablePuzzles.map((p) => ` → ${p}`).join("\n")}\n`,
            );

            await availablePuzzles.reduce(
              async (previousPromise: Promise<void>, puzzle) => {
                await previousPromise;

                const promise = await runPuzzleSolution(
                  logger,
                  puzzle,
                  {
                    spoilers: !!options.spoilers,
                    example: !!options.example,
                  },
                );
                console.log("");
                return promise;
              },
              Promise.resolve(),
            );
            return;
          },
        ),
    )
    .parse(Deno.args);
}

type SolutionModule = { solution: Solution };
function isSolutionModule(
  mod: Partial<SolutionModule> | undefined,
): mod is SolutionModule {
  return typeof mod === "object" && "solution" in mod && !!mod.solution;
}

async function fileExists(
  filePath: string,
): Promise<boolean> {
  try {
    const stat = await Deno.stat(filePath);
    return stat.isFile;
  } catch (err: unknown) {
    return false;
  }
}

async function runPuzzleSolution(
  logger: Logger,
  puzzle: string,
  {
    spoilers: noSpoilers = false,
    example: useExampleInput = false,
  }: {
    spoilers?: boolean;
    example?: boolean;
  },
) {
  const Box = new BoxFormatter();

  try {
    logger.debug(`Validating input data file`);
    let ioFile = `./src/io/day-${puzzle.split(".")[0]}${
      useExampleInput ? ".example" : ""
    }.txt`;
    if (!(await fileExists(ioFile))) {
      throw new Error(
        `The${
          useExampleInput ? " example" : ""
        } input file '${ioFile}' does not exist. Create it, before running again.`,
      );
    }

    const puzzleFile = `src/day-${puzzle}.ts`;
    const moduleFile = `./${puzzleFile}`;
    logger.debug(`Validating solution module file`);
    const mod: Partial<SolutionModule> | undefined = await import(moduleFile);
    if (!isSolutionModule(mod)) {
      throw new Error(
        `The '${moduleFile}' module should export a 'solution' of type Solution.`,
      );
    }

    logger.debug(`Attempting to run solution for '${moduleFile}'`);
    const startTime = new Date();

    const boxHeading = "RUNNING";
    console.log(Box.top(
      boxHeading,
      `
Day:  ${(puzzle.split(".")[0])}
Part: ${puzzle.split(".")[1]}
${puzzleFile}`.trim(),
    ));
    let answer: string | number = "NO-ANSWER";
    performance.mark("solution-start");
    await mod.solution({
      debug: (str) => {
        const _str = (typeof str === "object" || Array.isArray(str))
          ? JSON.stringify(str)
          : str.toString();
        const since = duration.format(+new Date() - +startTime, {
          ignoreZero: true,
          style: "narrow",
        });
        console.log(Box.body(`${
          color.dim(
            `[DEBUG]`,
          )
        } ${
          _str.toString().split("\n").map((line, i) =>
            i === 0 ? `${line}${since ? color.dim(` +${since}`) : ""}` : line
          ).join("\n")
        }`));
      },
      answer: (value) => {
        answer = value;
      },
      loadInput: async () => {
        logger.debug(`loadInput: ${ioFile}`);
        return (new TextDecoder("utf-8")).decode(await Deno.readFile(ioFile));
      },
    });
    performance.mark("solution-end");

    const perf = performance.measure(
      "solution-duration",
      "solution-start",
      "solution-end",
    );
    console.log(
      Box.bottom(
        boxHeading,
        `ANSWER ▶︎ ${
          color.reset(
            color.black(color.bgWhite(` ${noSpoilers ? "*****" : answer} `)),
          )
        }\nTIME   ▶︎ ${perf.duration}ms`,
      ),
    );

    logger.debug(`Solution finished.`);
  } catch (err) {
    console.log("");
    const header = "ERROR";
    console.log(Box.top(
      header,
      "▼ Message",
    ));
    console.log(
      Box.body(
        `${
          color.bold(err.message)
        }\n\n${(err.stack.split("\n").slice(1).map((l: string) =>
          "  " + color.dim(l.trim())
        ).join("\n"))}`,
      ),
    );
    console.log(Box.bottom(header, "▲ Stack"));
  }
}
