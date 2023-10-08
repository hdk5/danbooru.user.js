import { StringScanner } from "./StringScanner";

export class StringParser<StateType> {
  private scanner: StringScanner;
  state: StateType;

  constructor(input: { toString(): string }, state: StateType) {
    this.state = state;
    this.scanner = new StringScanner(input);
  }

  rest(): string {
    return this.scanner.getRemainder();
  }

  eos(): boolean {
    return this.scanner.hasTerminated();
  }

  accept(pattern: RegExp): string | null {
    return this.scanner.scan(pattern);
  }

  skip(pattern: RegExp): boolean {
    return this.accept(pattern) !== null;
  }

  expect(pattern: RegExp): string | null {
    return this.accept(pattern);
  }

  rewind(n: number = 1): void {
    this.scanner.setPosition(this.scanner.getPosition() - n);
  }

  backtrack<T>(parser: () => T | null): T | null {
    if (this.eos()) {
      return null;
    }

    const savedPos = this.scanner.getPosition();
    const savedState = window.structuredClone(this.state);

    const result = parser();

    if (result === null) {
      this.scanner.setPosition(savedPos);
      this.state = savedState;
    }

    return result;
  }

  zeroOrMore<T>(parser: () => T | null): T[] {
    const matches: T[] = [];

    for (;;) {
      const match = this.backtrack(parser);
      if (match === null) {
        break;
      }

      matches.push(match);
    }

    return matches;
  }

  oneOf<T>(parsers: (() => T | null)[]): T | null {
    for (const parser of parsers) {
      const result = this.backtrack(parser);
      if (result === null) {
        continue;
      }

      return result;
    }
    return null;
  }
}
