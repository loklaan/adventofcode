import { Input as CliffyInput } from "x/cliffy/prompt/mod.ts";
import * as log from "std/log/mod.ts";
import * as color from "std/fmt/colors.ts";
import * as datetime from "std/datetime/mod.ts";

export class Input extends CliffyInput {
  protected async complete(): Promise<string> {
    let input: string = this.getCurrentInputValue();

    if (!input.length) {
      const suggestion: string | undefined = this
        .suggestions[this.suggestionsIndex]?.toString();
      if (this.settings.complete) {
        input = await Promise.resolve(
          this.settings.complete(
            input,
            suggestion,
          ),
        );
      } else if (suggestion) {
        input = suggestion;
      }
      return input;
    }

    return super.complete();
  }
}

export function setupLogger(debug?: boolean) {
  const level = debug ? "DEBUG" : "INFO";
  log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler(level, {
        formatter: (record) =>
          `${
            color.dim(
              `${
                datetime.format(record.datetime, "hh:mma ss's'.SSS'ms'")
              } [${record.levelName}]`,
            )
          } ${record.msg}`,
      }),
    },
    loggers: {
      "default": {
        level,
        handlers: ["console"],
      },
    },
  });

  const logger = log.getLogger();
  if (level !== "INFO") {
    logger.info(`Logger initialised with level ${level}`);
  }

  return logger;
}

export class BoxFormatter {
  private i = 0;

  altPipe() {
    return this.i++ % 3 === 0 ? "╣" : "│";
  }

  top(heading: string, nestedHeading: string) {
    const nestedHeadings = nestedHeading.split("\n").map((line, i, all) =>
      (all.length > 1 && i < all.length - 1 ? `${this.altPipe()} ├─• ` : `${this.altPipe()} ╰─• `) + line
    );
    return color.dim(`
${color.italic(`╭─┬─ ${heading} ───────────────────────╼`)}
${nestedHeadings.join("\n")}
${this.altPipe()}`.trim());
  }

  body(str: string) {
    return str.split("\n").map((line) =>
      `${color.dim(this.altPipe())} ${line}`
    ).join("\n");
  }

  bottom(heading: string, footer: string) {
    return `
${color.dim(this.altPipe())}
${color.dim(`${this.altPipe()} ╭─• ${footer}`)}
${color.dim(`╰─┴──${"─".repeat(heading.length)}────────────────────────╼`)}`
      .trim();
  }
}

export type SolutionActions = {
  loadInput: () => Promise<string>;
  debug: (input: string | number) => void;
  answer: (value: string | number) => void;
};

export type Solution = (actions: SolutionActions) => Promise<void>;
