/*
Copyright © 2022 Dave Thomas

----

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS,” WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export class StringScanner {
  private source: string;
  private match!: string | null;
  private captures!: string[];
  private head!: number;
  private last!: number;

  /**
   * Create a new StringScanner containing the given string.
   *
   * @param source The string to be scanned. If not a string,
   * it will be converted using `toSAtring()`
   */
  constructor(source: { toString(): string }) {
    this.source = source.toString();
    this.reset();
  }

  /**
   * The `scan`, `scanUntil`, `scanChar`, `skip`, and `skipUntil` methods look
   * for matching strings and advance the scanner's position. The _scan_
   * methods return the matched string; the _skip_ methods return the number
   * of characters by which the scan position advanced.
   * -------------------------------------------------------------------------
   * Matches `regexp` at the current position. Returns the matched string
   * and advances the scanner's position, or returns `null` if there is no
   * match.
   *
   * @category Scanning and Skipping
   */
  scan(regexp: RegExp): string | null {
    const matches = regexp.exec(this.getRemainder());
    if (matches?.index === 0) {
      return this.setState(matches, {
        head: this.head + matches[0].length,
        last: this.head,
      });
    } else {
      return this.setState([]);
    }
  }

  /**
   * Matches `regexp` at _or after_ the current position. Returns the
   * portion of the source string after the scanner's position up to and
   * including the end of the match and advances the scanner's position,
   * or returns `null` if there is no match.
   *
   * @category Scanning and Skipping
   */
  scanUntil(regexp: RegExp): string | null {
    const matches = regexp.exec(this.getRemainder());
    if (matches) {
      this.setState(matches, {
        head: this.head + matches.index + matches[0].length,
        last: this.head,
      });
      return this.source.slice(this.last, this.head);
    } else {
      return this.setState([]);
    }
  }

  /**
   * Scans one character, returns it, and advances the scanner's position.
   *
   * @category Scanning and Skipping
   */
  scanChar(): string | null {
    return this.scan(/[\s\S]/);
  }

  /**
   * Skips over the given `regexp` at the current position. Returns the
   * length of the matched string and advances the scanner's position, or
   * returns `null` if there is no match.
   *
   * @category Scanning and Skipping
   */
  skip(regexp: RegExp): number | null {
    if (this.scan(regexp) === null) return null;

    return this.match!.length;
  }

  /**
   * Skips over the given `regexp` at _or after_ the current position.
   * Returns the length of the string up to and including the end of the
   * match and advances the scanner's position, or returns `null` if there
   * is no match.
   *
   * @category Scanning and Skipping
   */
  skipUntil(regexp: RegExp): number | null {
    if (this.scanUntil(regexp) === null) return null;

    return this.head - this.last;
  }

  /**
   * The `check`, `checkUntil` and `peek` methods look for matching strings
   * without advancing the scanner's position.
   * -------------------------------------------------------------------------
   * Checks to see if `regexp` can be matched at the current position and
   * returns the matched string without advancing the scanner's position, or
   * returns `null` if there is no match.
   * @category Looking Ahead
   *
   */
  check(regexp: RegExp): string | null {
    const matches = regexp.exec(this.getRemainder());
    if (matches === null || matches.index !== 0) return this.setState([]);

    return this.setState(matches);
  }

  /**
   * Checks to see if `regexp` can be matched at _or after_ the current
   * position. Returns the portion of the source string after the current
   * position up to and including the end of the match without advancing the
   * scanner's position, or returns `null` if there is no match.
   * @category Looking Ahead
   *
   */
  checkUntil(regexp: RegExp): string | null {
    const matches = regexp.exec(this.getRemainder());
    if (matches === null) return this.setState([]);

    this.setState(matches);
    return this.source.slice(
      this.head,
      this.head + matches.index + matches[0].length,
    );
  }

  /**
   * Returns the next `length` characters after the current position. If
   * called without a `length`, returns the next character. The scanner's
   * position is not advanced.
   *
   * @category Looking Ahead
   *
   */
  peek(length = 1): string {
    return this.source.substring(this.head, this.head + length);
  }

  /**
   * The `getSource`, `getRemainder`, `getPosition` and `hasTerminated`
   * methods provide information about the scanner's source string and
   * position.
   * -------------------------------------------------------------------------
   * Returns the scanner's source string.
   *
   * @category Accessing Scanner State
   *
   */
  getSource(): string {
    return this.source;
  }

  /**
   * Returns the portion of the source string from the scanner's position
   * onward.
   *
   * @category Accessing Scanner State
   *
   */
  getRemainder(): string {
    return this.source.slice(this.head);
  }

  /**
   * Returns the scanner's position. In the _reset_ position, this value is
   * zero. In the _terminated_ position, this value is the length of the
   * source string.
   * @category Accessing Scanner State
   *
   */
  getPosition(): number {
    return this.head;
  }

  /**
   * Checks to see if the scanner has reached the end of the string.
   *
   * @category Accessing Scanner State
   *
   */
  hasTerminated(): boolean {
    return this.head === this.source.length;
  }

  /**
   * The `getPreMatch`, `getMatch`, `getPostMatch` and `getCapture` methods
   * provide information about the most recent match.
   * -------------------------------------------------------------------------
   * Returns the portion of the source string leading up to, but not
   * including, the most recent match. (Returns `null` if there is no recent
   * match.)
   *
   * @category Accessing Match Data
   */
  getPreMatch(): string | null {
    if (this.match === null) return null;

    return this.source.slice(0, this.head - this.match.length);
  }

  /**
   * Returns the most recently matched portion of the source string (or
   * `null` if there is no recent match).
   *
   * @category Accessing Match Data
   */
  getMatch(): string | null {
    return this.match;
  }

  /**
   * Returns the portion of the source string immediately following the most
   * recent match. (Returns `null` if there is no recent match.)
   *
   * @category Accessing Match Data
   */
  getPostMatch(): string | null {
    if (this.match === null) return null;

    return this.source.slice(this.head);
  }

  /**
   * Returns the `index`th capture from the most recent match (or `null` if
   * there is no recent match).
   *
   * @category Accessing Match Data
   */
  getCapture(index: number): string | null {
    const capture = this.captures[index];
    if (capture === undefined) return null;

    return capture;
  }

  /**
   * The `reset`, `terminate`, `concat` and `unscan` methods let you change
   * the state of the scanner.
   * -------------------------------------------------------------------------
   * Resets the scanner back to its original position and clears its match
   * data.
   *
   * @category Modifying Scanner State
   */
  reset(): void {
    this.setState([], { head: 0, last: 0 });
  }

  /**
   * Advances the scanner position to the end of the string and clears its
   * match data.
   *
   * @category Modifying Scanner State
   */
  terminate(): void {
    this.setState([], { head: this.source.length, last: this.head });
  }

  /**
   * Appends `string` to the scanner's source string. The scanner's position
   * is not affected.
   *
   * @category Modifying Scanner State
   */
  concat(string: string): void {
    this.source += string;
  }

  /**
   * Sets the scanner's position to its previous position and clears its
   * match data. Only one previous position is stored.
   * Returns the previous match, or `null`.
   *
   * @category Modifying Scanner State
   */
  unscan(): string | null {
    const match = this.match;

    if (match !== null) this.setState([], { head: this.last, last: 0 });

    return match;
  }

  /**
   * Sets the scanner's position.
   *
   * @category Modifying Scanner State
   */
  setPosition(pos: number): void {
    this.setState([], { head: pos, last: this.head });
  }

  //#### Private methods

  /**
   *  Sets the state of the scanner
   *  @internal
   */
  private setState(
    matches: string[],
    { head, last }: { head?: number; last?: number } = {},
  ): string | null {
    if (head !== undefined) {
      if (head < 0) head = 0;

      this.head = head;
    }
    if (last !== undefined) this.last = last;

    this.captures = matches.slice(1);

    this.match = ((): string | null => {
      const match = matches[0];
      if (match === undefined) return null;

      return match;
    })();
    return this.match;
  }
}
