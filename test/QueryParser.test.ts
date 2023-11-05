import {
  ASTAll,
  ASTAnd,
  ASTMetatag,
  ASTNone,
  ASTNot,
  ASTOr,
  ASTTag,
  ASTWildcard,
} from '../src/AST'
import { QueryParser } from '../src/QueryParser'

it.each([
  {
    query: String.raw``,
    ast: new ASTAll(),
  },
  {
    query: String.raw` `,
    ast: new ASTAll(),
  },
  {
    query: String.raw`a`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`A`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`;)`,
    ast: new ASTTag(';)'),
  },
  {
    query: String.raw`(9)`,
    ast: new ASTTag('9'),
  },
  {
    query: String.raw`foo_(bar)`,
    ast: new ASTTag('foo_(bar)'),
  },
  {
    query: String.raw`(foo_(bar))`,
    ast: new ASTTag('foo_(bar)'),
  },
  {
    query: String.raw`((foo_(bar)))`,
    ast: new ASTTag('foo_(bar)'),
  },
  {
    query: String.raw`foo_(bar_(baz))`,
    ast: new ASTTag('foo_(bar_(baz))'),
  },
  {
    query: String.raw`(foo_(bar_(baz)))`,
    ast: new ASTTag('foo_(bar_(baz))'),
  },
  {
    query: String.raw`(foo_(bar_baz))`,
    ast: new ASTTag('foo_(bar_baz)'),
  },
  {
    query: String.raw`abc_(def) ghi`,
    ast: new ASTAnd(
      new ASTTag('abc_(def)'),
      new ASTTag('ghi'),
    ),
  },
  {
    query: String.raw`(abc_(def) ghi)`,
    ast: new ASTAnd(
      new ASTTag('abc_(def)'),
      new ASTTag('ghi'),
    ),
  },
  {
    query: String.raw`((abc_(def)) ghi)`,
    ast: new ASTAnd(
      new ASTTag('abc_(def)'),
      new ASTTag('ghi'),
    ),
  },
  {
    query: String.raw`abc def_(ghi)`,
    ast: new ASTAnd(
      new ASTTag('abc'),
      new ASTTag('def_(ghi)'),
    ),
  },
  {
    query: String.raw`(abc def_(ghi))`,
    ast: new ASTAnd(
      new ASTTag('abc'),
      new ASTTag('def_(ghi)'),
    ),
  },
  {
    query: String.raw`(abc (def_(ghi)))`,
    ast: new ASTAnd(
      new ASTTag('abc'),
      new ASTTag('def_(ghi)'),
    ),
  },
  {
    query: String.raw`abc_(def) ghi_(jkl)`,
    ast: new ASTAnd(
      new ASTTag('abc_(def)'),
      new ASTTag('ghi_(jkl)'),
    ),
  },
  {
    query: String.raw`(abc_(def) ghi_(jkl))`,
    ast: new ASTAnd(
      new ASTTag('abc_(def)'),
      new ASTTag('ghi_(jkl)'),
    ),
  },
  {
    query: String.raw`:)`,
    ast: new ASTTag(':)'),
  },
  {
    query: String.raw`(:))`,
    ast: new ASTTag(':)'),
  },
  {
    query: String.raw`(:)`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`(:) >:))`,
    ast: new ASTAnd(
      new ASTTag(':)'),
      new ASTTag('>:)'),
    ),
  },
  {
    query: String.raw`(:) >:)`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`*)`,
    ast: new ASTWildcard('*)'),
  },
  {
    query: String.raw`(*)`,
    ast: new ASTWildcard('*'),
  },
  {
    query: String.raw`(foo*)`,
    ast: new ASTWildcard('foo*'),
  },
  {
    query: String.raw`foo*)`,
    ast: new ASTWildcard('foo*)'),
  },
  {
    query: String.raw`foo*) bar`,
    ast: new ASTAnd(
      new ASTWildcard('foo*)'),
      new ASTTag('bar'),
    ),
  },
  {
    query: String.raw`(foo*) bar`,
    ast: new ASTAnd(
      new ASTWildcard('foo*'),
      new ASTTag('bar'),
    ),
  },
  {
    query: String.raw`(foo*) bar)`,
    ast: new ASTAnd(
      new ASTWildcard('foo*'),
      new ASTTag('bar)'),
    ),
  },
  {
    query: String.raw`*_(foo)`,
    ast: new ASTWildcard('*_(foo)'),
  },
  {
    query: String.raw`(*_(foo))`,
    ast: new ASTWildcard('*_(foo)'),
  },
  {
    query: String.raw`(*_(foo) bar)`,
    ast: new ASTAnd(
      new ASTWildcard('*_(foo)'),
      new ASTTag('bar'),
    ),
  },
  {
    query: String.raw`((*_(foo)) bar)`,
    ast: new ASTAnd(
      new ASTWildcard('*_(foo)'),
      new ASTTag('bar'),
    ),
  },
  {
    query: String.raw`(bar *_(foo))`,
    ast: new ASTAnd(
      new ASTTag('bar'),
      new ASTWildcard('*_(foo)'),
    ),
  },
  {
    query: String.raw`(bar (*_(foo)))`,
    ast: new ASTAnd(
      new ASTTag('bar'),
      new ASTWildcard('*_(foo)'),
    ),
  },
  {
    query: String.raw`(meta:a)`,
    ast: new ASTMetatag('meta', 'a'),
  },
  {
    query: String.raw`(meta:(a)`,
    ast: new ASTMetatag('meta', '(a'),
  },
  {
    query: String.raw`(meta:(a))`,
    ast: new ASTMetatag('meta', '(a)'),
  },
  {
    query: String.raw`(meta:a meta:b)`,
    ast: new ASTAnd(
      new ASTMetatag('meta', 'a'),
      new ASTMetatag('meta', 'b'),
    ),
  },
  {
    query: String.raw`(meta:a) meta:b)`,
    ast: new ASTAnd(
      new ASTMetatag('meta', 'a'),
      new ASTMetatag('meta', 'b)'),
    ),
  },
  {
    query: String.raw`(meta:"a)" meta:b)`,
    ast: new ASTAnd(
      new ASTMetatag('meta', 'a)'),
      new ASTMetatag('meta', 'b'),
    ),
  },
  {
    query: String.raw`a b`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`a or b`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`~a ~b`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`-a`,
    ast: new ASTNot(
      new ASTTag('a'),
    ),
  },
  {
    query: String.raw`a -b`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTNot(
        new ASTTag('b'),
      ),
    ),
  },
  {
    query: String.raw`meta:a`,
    ast: new ASTMetatag('meta', 'a'),
  },
  {
    query: String.raw`-meta:a`,
    ast: new ASTNot(
      new ASTMetatag('meta', 'a'),
    ),
  },
  {
    query: String.raw`meta:a meta:b`,
    ast: new ASTAnd(
      new ASTMetatag('meta', 'a'),
      new ASTMetatag('meta', 'b'),
    ),
  },
  {
    query: String.raw`meta:a`,
    ast: new ASTMetatag('meta', 'a'),
  },
  {
    query: String.raw`META:a`,
    ast: new ASTMetatag('meta', 'a'),
  },
  {
    query: String.raw`meta:A`,
    ast: new ASTMetatag('meta', 'A'),
  },
  {
    query: String.raw`~meta:a`,
    ast: new ASTMetatag('meta', 'a'),
  },
  {
    query: String.raw`-meta:a`,
    ast: new ASTNot(
      new ASTMetatag('meta', 'a'),
    ),
  },
  {
    query: String.raw`meta:a meta:b`,
    ast: new ASTAnd(
      new ASTMetatag('meta', 'a'),
      new ASTMetatag('meta', 'b'),
    ),
  },
  {
    query: String.raw`~meta:a ~meta:b`,
    ast: new ASTOr(
      new ASTMetatag('meta', 'a'),
      new ASTMetatag('meta', 'b'),
    ),
  },
  {
    query: String.raw`meta:a or meta:b`,
    ast: new ASTOr(
      new ASTMetatag('meta', 'a'),
      new ASTMetatag('meta', 'b'),
    ),
  },
  {
    query: String.raw`(meta:a)`,
    ast: new ASTMetatag('meta', 'a'),
  },
  {
    query: String.raw`meta:(a)`,
    ast: new ASTMetatag('meta', '(a)'),
  },
  {
    query: String.raw`(meta:(a)`,
    ast: new ASTMetatag('meta', '(a'),
  },
  {
    query: String.raw`meta:"foo bar"`,
    ast: new ASTMetatag('meta', 'foo bar'),
  },
  {
    query: String.raw`meta:foobar"(`,
    ast: new ASTMetatag('meta', 'foobar"('),
  },
  {
    query: String.raw`meta:`,
    ast: new ASTMetatag('meta', ''),
  },
  {
    query: String.raw`meta:""`,
    ast: new ASTMetatag('meta', ''),
  },
  {
    query: String.raw`meta:"\""`,
    ast: new ASTMetatag('meta', '"'),
  },
  {
    query: String.raw`meta:"don't say \"lazy\" okay"`,
    ast: new ASTMetatag('meta', 'don\'t say "lazy" okay'),
  },
  {
    query: String.raw`(a (meta:"foo)bar"))`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTMetatag('meta', 'foo)bar'),
    ),
  },
  {
    query: String.raw`meta:'foo bar'`,
    ast: new ASTMetatag('meta', 'foo bar'),
  },
  {
    query: String.raw`meta:foobar'(`,
    ast: new ASTMetatag('meta', 'foobar\'('),
  },
  {
    query: String.raw`meta:''`,
    ast: new ASTMetatag('meta', ''),
  },
  {
    query: String.raw`meta:'\''`,
    ast: new ASTMetatag('meta', '\''),
  },
  {
    query: String.raw`meta:'don\'t say "lazy" okay'`,
    ast: new ASTMetatag('meta', 'don\'t say "lazy" okay'),
  },
  {
    query: String.raw`(a (source:'foo)bar'))`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('source:\'foo)bar\''),
    ),
  },
  {
    query: String.raw`*`,
    ast: new ASTWildcard('*'),
  },
  {
    query: String.raw`*a`,
    ast: new ASTWildcard('*a'),
  },
  {
    query: String.raw`a*`,
    ast: new ASTWildcard('a*'),
  },
  {
    query: String.raw`*a*`,
    ast: new ASTWildcard('*a*'),
  },
  {
    query: String.raw`a*b`,
    ast: new ASTWildcard('a*b'),
  },
  {
    query: String.raw`* b`,
    ast: new ASTAnd(
      new ASTWildcard('*'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`*a b`,
    ast: new ASTAnd(
      new ASTWildcard('*a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`a* b`,
    ast: new ASTAnd(
      new ASTWildcard('a*'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`*a* b`,
    ast: new ASTAnd(
      new ASTWildcard('*a*'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`a *`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTWildcard('*'),
    ),
  },
  {
    query: String.raw`a *b`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTWildcard('*b'),
    ),
  },
  {
    query: String.raw`a b*`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTWildcard('b*'),
    ),
  },
  {
    query: String.raw`a *b*`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTWildcard('*b*'),
    ),
  },
  {
    query: String.raw`a -*`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTNot(
        new ASTWildcard('*'),
      ),
    ),
  },
  {
    query: String.raw`a -b*`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTNot(
        new ASTWildcard('b*'),
      ),
    ),
  },
  {
    query: String.raw`a -*b`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTNot(
        new ASTWildcard('*b'),
      ),
    ),
  },
  {
    query: String.raw`a -*b*`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTNot(
        new ASTWildcard('*b*'),
      ),
    ),
  },
  {
    query: String.raw`~a ~*`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTWildcard('*'),
    ),
  },
  {
    query: String.raw`~* ~a`,
    ast: new ASTOr(
      new ASTWildcard('*'),
      new ASTTag('a'),
    ),
  },
  {
    query: String.raw`~a ~*a`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTWildcard('*a'),
    ),
  },
  {
    query: String.raw`~*a ~a`,
    ast: new ASTOr(
      new ASTWildcard('*a'),
      new ASTTag('a'),
    ),
  },
  {
    query: String.raw`a or a*`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTWildcard('a*'),
    ),
  },
  {
    query: String.raw`a and a*`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTWildcard('a*'),
    ),
  },
  {
    query: String.raw`a* b*`,
    ast: new ASTAnd(
      new ASTWildcard('a*'),
      new ASTWildcard('b*'),
    ),
  },
  {
    query: String.raw`a* or b*`,
    ast: new ASTOr(
      new ASTWildcard('a*'),
      new ASTWildcard('b*'),
    ),
  },
  {
    query: String.raw`a b* c`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTWildcard('b*'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`a -* c`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTNot(
          new ASTWildcard('*'),
        ),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`a`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`a `,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw` a`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw` a `,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`(a)`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`( a)`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`(a )`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw` ( a ) `,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`((a))`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`( ( a ) )`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw` ( ( a ) ) `,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`a b`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`(a b)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`a (b)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`(a) b`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`(a) (b)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`((a) (b))`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`a b c`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`(a b) c`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`((a) b) c`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`(((a) b) c)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`((a b) c)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`((a) (b) (c))`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`a (b c)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`a (b (c))`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`(a (b (c)))`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`(a (b c))`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`(a b c)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`a and b`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`a AND b`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`(a and b)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`a and b and c`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`(a and b) and c`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`a and (b and c)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`(a and b and c)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`a or b`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`a OR b`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`(a or b)`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`(a) or (b)`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`a or b or c`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`(a or b) or c`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`a or (b or c)`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`(a or b or c)`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`a or (b or (c or d))`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTOr(
          new ASTTag('c'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw`((a or b) or c) or d`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTOr(
          new ASTTag('c'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw`(a or b) or (c or d)`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTOr(
          new ASTTag('c'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw`~a ~b`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`~a ~b ~c`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`~a ~b ~c ~d`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTOr(
          new ASTTag('c'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw`~a`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`(~a)`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`~(a)`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`~(~a)`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`~(~(~a))`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`~(-a)`,
    ast: new ASTNot(
      new ASTTag('a'),
    ),
  },
  {
    query: String.raw`-(~a)`,
    ast: new ASTNot(
      new ASTTag('a'),
    ),
  },
  {
    query: String.raw`-(~(-(~a)))`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`~(-(~(-a)))`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`a ~b`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`~a b`,
    ast: new ASTAnd(
      new ASTTag('b'),
      new ASTTag('a'),
    ),
  },
  {
    query: String.raw`((a) ~b)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`~(a b)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`~a and ~b`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`~a or ~b`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`~(-a) or ~(-b)`,
    ast: new ASTOr(
      new ASTNot(
        new ASTTag('a'),
      ),
      new ASTNot(
        new ASTTag('b'),
      ),
    ),
  },
  {
    query: String.raw`~(a) ~(b)`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`(~a) (~b)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTTag('b'),
    ),
  },
  {
    query: String.raw`(~a) ~b ~c`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`~a (~b ~c)`,
    ast: new ASTAnd(
      new ASTOr(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
      new ASTTag('a'),
    ),
  },
  {
    query: String.raw`~a ~b or ~c ~d`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTOr(
          new ASTTag('c'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw`~a ~b and ~c ~d`,
    ast: new ASTAnd(
      new ASTOr(
        new ASTTag('a'),
        new ASTTag('b'),
      ),
      new ASTOr(
        new ASTTag('c'),
        new ASTTag('d'),
      ),
    ),
  },
  {
    query: String.raw`(~a ~b) (~c ~d)`,
    ast: new ASTAnd(
      new ASTOr(
        new ASTTag('a'),
        new ASTTag('b'),
      ),
      new ASTOr(
        new ASTTag('c'),
        new ASTTag('d'),
      ),
    ),
  },
  {
    query: String.raw`~(a b) ~(c d)`,
    ast: new ASTOr(
      new ASTAnd(
        new ASTTag('a'),
        new ASTTag('b'),
      ),
      new ASTAnd(
        new ASTTag('c'),
        new ASTTag('d'),
      ),
    ),
  },
  {
    query: String.raw`(a b) or (c d)`,
    ast: new ASTOr(
      new ASTAnd(
        new ASTTag('a'),
        new ASTTag('b'),
      ),
      new ASTAnd(
        new ASTTag('c'),
        new ASTTag('d'),
      ),
    ),
  },
  {
    query: String.raw` a  b  c  d`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTAnd(
          new ASTTag('c'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw` a  b  c ~d`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTAnd(
          new ASTTag('c'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw` a  b ~c  d`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTAnd(
          new ASTTag('d'),
          new ASTTag('c'),
        ),
      ),
    ),
  },
  {
    query: String.raw` a  b ~c ~d`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTOr(
          new ASTTag('c'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw` a ~b  c  d`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('c'),
        new ASTAnd(
          new ASTTag('d'),
          new ASTTag('b'),
        ),
      ),
    ),
  },
  {
    query: String.raw` a ~b  c ~d`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('c'),
        new ASTOr(
          new ASTTag('b'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw` a ~b ~c  d`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('d'),
        new ASTOr(
          new ASTTag('b'),
          new ASTTag('c'),
        ),
      ),
    ),
  },
  {
    query: String.raw` a ~b ~c ~d`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTOr(
          new ASTTag('c'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw`~a  b  c  d`,
    ast: new ASTAnd(
      new ASTTag('b'),
      new ASTAnd(
        new ASTTag('c'),
        new ASTAnd(
          new ASTTag('d'),
          new ASTTag('a'),
        ),
      ),
    ),
  },
  {
    query: String.raw`~a  b  c ~d`,
    ast: new ASTAnd(
      new ASTTag('b'),
      new ASTAnd(
        new ASTTag('c'),
        new ASTOr(
          new ASTTag('a'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw`~a  b ~c  d`,
    ast: new ASTAnd(
      new ASTTag('b'),
      new ASTAnd(
        new ASTTag('d'),
        new ASTOr(
          new ASTTag('a'),
          new ASTTag('c'),
        ),
      ),
    ),
  },
  {
    query: String.raw`~a  b ~c ~d`,
    ast: new ASTAnd(
      new ASTTag('b'),
      new ASTOr(
        new ASTTag('a'),
        new ASTOr(
          new ASTTag('c'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw`~a ~b  c  d`,
    ast: new ASTAnd(
      new ASTTag('c'),
      new ASTAnd(
        new ASTTag('d'),
        new ASTOr(
          new ASTTag('a'),
          new ASTTag('b'),
        ),
      ),
    ),
  },
  {
    query: String.raw`~a ~b  c ~d`,
    ast: new ASTAnd(
      new ASTTag('c'),
      new ASTOr(
        new ASTTag('a'),
        new ASTOr(
          new ASTTag('b'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw`~a ~b ~c  d`,
    ast: new ASTAnd(
      new ASTTag('d'),
      new ASTOr(
        new ASTTag('a'),
        new ASTOr(
          new ASTTag('b'),
          new ASTTag('c'),
        ),
      ),
    ),
  },
  {
    query: String.raw`~a ~b ~c ~d`,
    ast: new ASTOr(
      new ASTTag('a'),
      new ASTOr(
        new ASTTag('b'),
        new ASTOr(
          new ASTTag('c'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw`-a`,
    ast: new ASTNot(
      new ASTTag('a'),
    ),
  },
  {
    query: String.raw`(a -b)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTNot(
        new ASTTag('b'),
      ),
    ),
  },
  {
    query: String.raw`a (-b)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTNot(
        new ASTTag('b'),
      ),
    ),
  },
  {
    query: String.raw`((a) -b)`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTNot(
        new ASTTag('b'),
      ),
    ),
  },
  {
    query: String.raw`-a`,
    ast: new ASTNot(
      new ASTTag('a'),
    ),
  },
  {
    query: String.raw`-(-(-a))`,
    ast: new ASTNot(
      new ASTTag('a'),
    ),
  },
  {
    query: String.raw`-(-a)`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`-(-(-(-a)))`,
    ast: new ASTTag('a'),
  },
  {
    query: String.raw`a -(-(b)) c`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTTag('c'),
      ),
    ),
  },
  {
    query: String.raw`a -(-(b -(-c))) d`,
    ast: new ASTAnd(
      new ASTTag('a'),
      new ASTAnd(
        new ASTTag('b'),
        new ASTAnd(
          new ASTTag('c'),
          new ASTTag('d'),
        ),
      ),
    ),
  },
  {
    query: String.raw`(`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`)`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`-`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`~`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`(a`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`)a`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`-~a`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`~-a`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`~~a`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`--a`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`and`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`-and`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`~and`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`or`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`-or`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`~or`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`a and`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`a or`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`and a`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`or a`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`a -`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`a ~`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`(a b`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`(a (b)`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`meta:"foo`,
    ast: new ASTNone(),
  },
  {
    query: String.raw`meta:"foo bar`,
    ast: new ASTNone(),
  },
])('.parse(`$query`)', ({ query, ast }) => {
  const parsed = QueryParser.parse(query, ['meta'])
  expect(parsed).toStrictEqual(ast)
})
