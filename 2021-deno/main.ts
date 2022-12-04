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
    entry.name.endsWith(".ts")
  ).map((entry) => (entry.name).replace(/^day-(.*)\.ts$/, "$1"))
    .sort();

  await new Command()
    .name("adventofcode")
    .description("Run puzzles for Advent Of Code 2021")
    .env("DEBUG=<enable:boolean>", "Enable debug output.")
    .arguments("[puzzle:string]")
    .action(async (options, puzzle) => {
      const logger = setupLogger(options.debug);

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
      await runPuzzleSolution(logger, confirmedPuzzle);
    })
    .command(
      "all",
      new Command()
        .description("Run all puzzles sequentially.")
        .env("DEBUG=<enable:boolean>", "Enable debug output.")
        .arguments("")
        .action(
          async (options) => {
            const logger = setupLogger(options.debug);

            logger.debug(`Actioning 'all' command.`);

            console.log(
              `Running all available puzzles:\n\n${
                availablePuzzles.map((p) => ` → ${p}`).join("\n")
              }\n`,
            );

            await availablePuzzles.reduce(
              async (previousPromise: Promise<void>, puzzle) => {
                await previousPromise;

                const promise = await runPuzzleSolution(logger, puzzle);
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
async function runPuzzleSolution(logger: Logger, puzzle: string) {
  try {
    const puzzleName = `Day ${puzzle.split(".")[0]}, part ${
      puzzle.split(".")[1]
    }`;
    const puzzleFile = `src/day-${puzzle}.ts`;
    const moduleFile = `./${puzzleFile}`;
    const mod: Partial<SolutionModule> | undefined = await import(moduleFile);
    if (!isSolutionModule(mod)) {
      throw new Error(
        `The '${moduleFile}' module should export a 'solution' of type Solution.`,
      );
    }

    logger.debug(`Attempting to run solution for '${moduleFile}'`);
    const startTime = new Date();

    const boxHeading = "RUNNING";
    console.log(BoxFormatter.top(boxHeading, puzzleName + "\n" + puzzleFile));
    let answer: string | number = "NO-ANSWER";
    await mod.solution({
      debug: (str) => {
        const since = duration.format(+new Date() - +startTime, {
          ignoreZero: true,
          style: "narrow",
        });
        console.log(BoxFormatter.body(`${
          color.dim(
            `[DEBUG]`,
          )
        } ${
          str.toString().split("\n").map((line, i) =>
            i === 0 ? `${line}${since ? color.dim(` +${since}`) : ""}` : line
          ).join("\n")
        }`));
      },
      answer: (value) => {
        answer = value;
      },
      loadInput: async () => {
        const ioFile = `./src/io/day-${puzzle.split(".")[0]}.txt`;
        logger.debug(`loadInput: ${ioFile}`);
        const decoder = new TextDecoder("utf-8");
        const data = await Deno.readFile(ioFile);
        return decoder.decode(data);
      },
    });

    console.log(
      BoxFormatter.bottom(
        boxHeading,
        `ANSWER → ${color.reset(color.black(color.bgWhite(` ${answer} `)))}`,
      ),
    );

    logger.debug(`Solution finished.`);
  } catch (err) {
    console.log("");
    console.error(err);
  }
}
