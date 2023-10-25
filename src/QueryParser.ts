import {
  ASTAll,
  AST,
  ASTTag,
  ASTWildcard,
  ASTMetatag,
  ASTNot,
  ASTAnd,
  ASTOr,
  ASTNone,
} from "./AST";
import { StringParser } from "./StringParser";

class Factor {
  constructor(readonly ast: AST) {}
}

class FactorTag extends Factor {}
class FactorNot extends Factor {}
class FactorOpt extends Factor {}

export class QueryParser {
  static readonly PERMITTED_UNBALANCED_TAGS: readonly string[] = [
    ":)",
    ":(",
    ";)",
    ";(",
    ">:)",
    ">:(",
  ];

  private parser: StringParser<number>;
  private metatagRegex: RegExp;

  private constructor(input: string, metatags: string[]) {
    this.parser = new StringParser<number>(input, 0);
    this.metatagRegex = RegExp(`(${metatags.join("|")}):`, "i");
  }

  static parse(input: string, metatags: string[] = []): AST {
    return new QueryParser(input, metatags).parse();
  }

  private parse(): AST {
    let ast: AST | null = this.root();

    if (!this.parser.eos()) ast = null;

    if (this.parser.state !== 0) ast = null;

    if (ast === null) return new ASTNone();

    return ast.simplify();
  }

  private root(): AST | null {
    const factorList = this.parser.zeroOrMore(this.orClause.bind(this));
    this.space();

    let a = new ASTAll();

    for (const b of factorList) a = new ASTAnd(a, b);

    return a;
  }

  private orClause(): AST | null {
    const a = this.andClause();
    if (a === null) return null;

    this.space();

    if (this.parser.accept(/or +/i) !== null) {
      const b = this.orClause();
      if (b === null) return null;

      return new ASTOr(a, b);
    }

    return a;
  }

  private andClause(): AST | null {
    const a = this.factorList();
    if (a === null) return null;

    this.space();

    if (this.parser.accept(/and +/i) !== null) {
      const b = this.andClause();
      if (b === null) return null;

      return new ASTAnd(a, b);
    }

    return a;
  }

  private factorList(): AST | null {
    const factorList = this.parser.zeroOrMore(this.factor.bind(this));
    if (factorList.length === 0) return null;

    let and: AST = new ASTAll();
    let or: AST = new ASTNone();

    for (const factor of factorList) {
      let ast = factor.ast;

      if (factor instanceof FactorNot) ast = new ASTNot(ast);

      if (factor instanceof FactorOpt) or = new ASTOr(or, ast);
      else and = new ASTAnd(and, ast);
    }

    if (or instanceof ASTOr) and = new ASTAnd(and, or);

    return and;
  }

  private factor(): Factor | null {
    this.space();

    let FactorCtor: new (ast: AST) => Factor;
    if (this.parser.accept(/-/) !== null) FactorCtor = FactorNot;
    else if (this.parser.accept(/~/) !== null) FactorCtor = FactorOpt;
    else FactorCtor = FactorTag;

    const expr = this.expr();
    if (expr === null) return null;

    return new FactorCtor(expr);
  }

  private expr(): AST | null {
    this.space();

    if (this.parser.accept(/\(/)) {
      ++this.parser.state;
      const a = this.orClause();
      if (a === null || this.parser.accept(/\)/) === null) return null;

      --this.parser.state;
      return a;
    }

    return this.term();
  }

  private term(): AST | null {
    return this.parser.oneOf([
      this.tag.bind(this),
      this.metatag.bind(this),
      this.wildcard.bind(this),
    ]);
  }

  private metatag(): AST | null {
    let name = this.parser.accept(this.metatagRegex);
    if (name === null) return null;

    name = name.slice(0, -1);

    const value = this.quotedString();
    if (value === null) return null;

    return new ASTMetatag(name, value);
  }

  private quotedString(): string | null {
    if (this.parser.accept(/"/) !== null) {
      const a = this.parser.accept(/([^"\\]|\\")*/)!.replaceAll(/\\"/g, '"');
      if (this.parser.accept(/"/) === null) return null;

      return a;
    }

    if (this.parser.accept(/'/) !== null) {
      const a = this.parser.accept(/([^'\\]|\\')*/)!.replaceAll(/\\'/g, "'");
      if (this.parser.accept(/'/) === null) return null;

      return a;
    }

    return this.string(/[^ ]*/);
  }

  private wildcard(): AST | null {
    const t = this.string(/(?=[^ ]*\*)[^ )~-][^ ]*/, true);
    if (t === null || this.metatagRegex.exec(t)?.index === 0) return null;

    this.space();
    return new ASTWildcard(t);
  }

  private tag(): AST | null {
    const t = this.string(/[^ )~-][^ ]*/, true);
    if (
      t === null ||
      ["and", "or"].includes(t.toLowerCase()) ||
      t.includes("*") ||
      this.metatagRegex.exec(t)?.index === 0
    )
      return null;

    this.space();
    return new ASTTag(t);
  }

  private string(pattern: RegExp, skipBalancedParens = false): string | null {
    let str = this.parser.accept(pattern);
    if (str === null) return null;

    let n = this.parser.state;
    while (n-- > 0 && str.endsWith(")")) {
      if (
        skipBalancedParens &&
        (QueryParser.hasBalancedParens(str) ||
          QueryParser.PERMITTED_UNBALANCED_TAGS.includes(str))
      )
        break;

      str = str.slice(0, -1);
      this.parser.rewind();
    }

    return str;
  }

  private space(): string {
    return this.parser.accept(/ */)!;
  }

  private static hasBalancedParens(
    str: string,
    open = "(",
    close = ")",
  ): boolean {
    let parens = 0;

    for (const char of str) {
      if (char === open) ++parens;
      else if (char === close) if (--parens < 0) return false;
    }

    return parens === 0;
  }
}
