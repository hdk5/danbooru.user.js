import {
  ASTAll,
  ASTAnd,
  ASTMetatag,
  ASTNone,
  ASTNot,
  ASTOr,
  ASTTag,
  ASTWildcard,
} from "../src/AST";
import { QueryParser } from "../src/QueryParser";

function expectParsed(query: string, expected: AST): void {
  // expected = expected.simplify();
  const parsed = QueryParser.parse(query, ["meta"]);
  expect(parsed).toStrictEqual(expected);
}

test("QueryParser: ``", () => {
  expectParsed(String.raw``, new ASTAll());
});

test("QueryParser: ` `", () => {
  expectParsed(String.raw` `, new ASTAll());
});

test("QueryParser: `a`", () => {
  expectParsed(String.raw`a`, new ASTTag("a"));
});

test("QueryParser: `A`", () => {
  expectParsed(String.raw`A`, new ASTTag("a"));
});

test("QueryParser: `;)`", () => {
  expectParsed(String.raw`;)`, new ASTTag(";)"));
});

test("QueryParser: `(9)`", () => {
  expectParsed(String.raw`(9)`, new ASTTag("9"));
});

test("QueryParser: `foo_(bar)`", () => {
  expectParsed(String.raw`foo_(bar)`, new ASTTag("foo_(bar)"));
});

test("QueryParser: `(foo_(bar))`", () => {
  expectParsed(String.raw`(foo_(bar))`, new ASTTag("foo_(bar)"));
});

test("QueryParser: `((foo_(bar)))`", () => {
  expectParsed(String.raw`((foo_(bar)))`, new ASTTag("foo_(bar)"));
});

test("QueryParser: `foo_(bar_(baz))`", () => {
  expectParsed(String.raw`foo_(bar_(baz))`, new ASTTag("foo_(bar_(baz))"));
});

test("QueryParser: `(foo_(bar_(baz)))`", () => {
  expectParsed(String.raw`(foo_(bar_(baz)))`, new ASTTag("foo_(bar_(baz))"));
});

test("QueryParser: `(foo_(bar_baz))`", () => {
  expectParsed(String.raw`(foo_(bar_baz))`, new ASTTag("foo_(bar_baz)"));
});

test("QueryParser: `abc_(def) ghi`", () => {
  expectParsed(
    String.raw`abc_(def) ghi`,
    new ASTAnd(new ASTTag("abc_(def)"), new ASTTag("ghi")),
  );
});

test("QueryParser: `(abc_(def) ghi)`", () => {
  expectParsed(
    String.raw`(abc_(def) ghi)`,
    new ASTAnd(new ASTTag("abc_(def)"), new ASTTag("ghi")),
  );
});

test("QueryParser: `((abc_(def)) ghi)`", () => {
  expectParsed(
    String.raw`((abc_(def)) ghi)`,
    new ASTAnd(new ASTTag("abc_(def)"), new ASTTag("ghi")),
  );
});

test("QueryParser: `abc def_(ghi)`", () => {
  expectParsed(
    String.raw`abc def_(ghi)`,
    new ASTAnd(new ASTTag("abc"), new ASTTag("def_(ghi)")),
  );
});

test("QueryParser: `(abc def_(ghi))`", () => {
  expectParsed(
    String.raw`(abc def_(ghi))`,
    new ASTAnd(new ASTTag("abc"), new ASTTag("def_(ghi)")),
  );
});

test("QueryParser: `(abc (def_(ghi)))`", () => {
  expectParsed(
    String.raw`(abc (def_(ghi)))`,
    new ASTAnd(new ASTTag("abc"), new ASTTag("def_(ghi)")),
  );
});

test("QueryParser: `abc_(def) ghi_(jkl)`", () => {
  expectParsed(
    String.raw`abc_(def) ghi_(jkl)`,
    new ASTAnd(new ASTTag("abc_(def)"), new ASTTag("ghi_(jkl)")),
  );
});

test("QueryParser: `(abc_(def) ghi_(jkl))`", () => {
  expectParsed(
    String.raw`(abc_(def) ghi_(jkl))`,
    new ASTAnd(new ASTTag("abc_(def)"), new ASTTag("ghi_(jkl)")),
  );
});

test("QueryParser: `:)`", () => {
  expectParsed(String.raw`:)`, new ASTTag(":)"));
});

test("QueryParser: `(:))`", () => {
  expectParsed(String.raw`(:))`, new ASTTag(":)"));
});

test("QueryParser: `(:)`", () => {
  expectParsed(String.raw`(:)`, new ASTNone());
});

test("QueryParser: `(:) >:))`", () => {
  expectParsed(
    String.raw`(:) >:))`,
    new ASTAnd(new ASTTag(":)"), new ASTTag(">:)")),
  );
});

test("QueryParser: `(:) >:)`", () => {
  expectParsed(String.raw`(:) >:)`, new ASTNone());
});

test("QueryParser: `*)`", () => {
  expectParsed(String.raw`*)`, new ASTWildcard("*)"));
});

test("QueryParser: `(*)`", () => {
  expectParsed(String.raw`(*)`, new ASTWildcard("*"));
});

test("QueryParser: `(foo*)`", () => {
  expectParsed(String.raw`(foo*)`, new ASTWildcard("foo*"));
});

test("QueryParser: `foo*)`", () => {
  expectParsed(String.raw`foo*)`, new ASTWildcard("foo*)"));
});

test("QueryParser: `foo*) bar`", () => {
  expectParsed(
    String.raw`foo*) bar`,
    new ASTAnd(new ASTWildcard("foo*)"), new ASTTag("bar")),
  );
});

test("QueryParser: `(foo*) bar`", () => {
  expectParsed(
    String.raw`(foo*) bar`,
    new ASTAnd(new ASTWildcard("foo*"), new ASTTag("bar")),
  );
});

test("QueryParser: `(foo*) bar)`", () => {
  expectParsed(
    String.raw`(foo*) bar)`,
    new ASTAnd(new ASTWildcard("foo*"), new ASTTag("bar)")),
  );
});

test("QueryParser: `*_(foo)`", () => {
  expectParsed(String.raw`*_(foo)`, new ASTWildcard("*_(foo)"));
});

test("QueryParser: `(*_(foo))`", () => {
  expectParsed(String.raw`(*_(foo))`, new ASTWildcard("*_(foo)"));
});

test("QueryParser: `(*_(foo) bar)`", () => {
  expectParsed(
    String.raw`(*_(foo) bar)`,
    new ASTAnd(new ASTWildcard("*_(foo)"), new ASTTag("bar")),
  );
});

test("QueryParser: `((*_(foo)) bar)`", () => {
  expectParsed(
    String.raw`((*_(foo)) bar)`,
    new ASTAnd(new ASTWildcard("*_(foo)"), new ASTTag("bar")),
  );
});

test("QueryParser: `(bar *_(foo))`", () => {
  expectParsed(
    String.raw`(bar *_(foo))`,
    new ASTAnd(new ASTTag("bar"), new ASTWildcard("*_(foo)")),
  );
});

test("QueryParser: `(bar (*_(foo)))`", () => {
  expectParsed(
    String.raw`(bar (*_(foo)))`,
    new ASTAnd(new ASTTag("bar"), new ASTWildcard("*_(foo)")),
  );
});

test("QueryParser: `(meta:a)`", () => {
  expectParsed(String.raw`(meta:a)`, new ASTMetatag("meta", "a"));
});

test("QueryParser: `(meta:(a)`", () => {
  expectParsed(String.raw`(meta:(a)`, new ASTMetatag("meta", "(a"));
});

test("QueryParser: `(meta:(a))`", () => {
  expectParsed(String.raw`(meta:(a))`, new ASTMetatag("meta", "(a)"));
});

test("QueryParser: `(meta:a meta:b)`", () => {
  expectParsed(
    String.raw`(meta:a meta:b)`,
    new ASTAnd(new ASTMetatag("meta", "a"), new ASTMetatag("meta", "b")),
  );
});

test("QueryParser: `(meta:a) meta:b)`", () => {
  expectParsed(
    String.raw`(meta:a) meta:b)`,
    new ASTAnd(new ASTMetatag("meta", "a"), new ASTMetatag("meta", "b)")),
  );
});

test('QueryParser: `(meta:"a)" meta:b)`', () => {
  expectParsed(
    String.raw`(meta:"a)" meta:b)`,
    new ASTAnd(new ASTMetatag("meta", "a)"), new ASTMetatag("meta", "b")),
  );
});

test("QueryParser: `a b`", () => {
  expectParsed(String.raw`a b`, new ASTAnd(new ASTTag("a"), new ASTTag("b")));
});

test("QueryParser: `a or b`", () => {
  expectParsed(String.raw`a or b`, new ASTOr(new ASTTag("a"), new ASTTag("b")));
});

test("QueryParser: `~a ~b`", () => {
  expectParsed(String.raw`~a ~b`, new ASTOr(new ASTTag("a"), new ASTTag("b")));
});

test("QueryParser: `-a`", () => {
  expectParsed(String.raw`-a`, new ASTNot(new ASTTag("a")));
});

test("QueryParser: `a -b`", () => {
  expectParsed(
    String.raw`a -b`,
    new ASTAnd(new ASTTag("a"), new ASTNot(new ASTTag("b"))),
  );
});

test("QueryParser: `meta:a`", () => {
  expectParsed(String.raw`meta:a`, new ASTMetatag("meta", "a"));
});

test("QueryParser: `-meta:a`", () => {
  expectParsed(String.raw`-meta:a`, new ASTNot(new ASTMetatag("meta", "a")));
});

test("QueryParser: `meta:a meta:b`", () => {
  expectParsed(
    String.raw`meta:a meta:b`,
    new ASTAnd(new ASTMetatag("meta", "a"), new ASTMetatag("meta", "b")),
  );
});

test("QueryParser: `meta:a`", () => {
  expectParsed(String.raw`meta:a`, new ASTMetatag("meta", "a"));
});

test("QueryParser: `META:a`", () => {
  expectParsed(String.raw`META:a`, new ASTMetatag("meta", "a"));
});

test("QueryParser: `meta:A`", () => {
  expectParsed(String.raw`meta:A`, new ASTMetatag("meta", "A"));
});

test("QueryParser: `~meta:a`", () => {
  expectParsed(String.raw`~meta:a`, new ASTMetatag("meta", "a"));
});

test("QueryParser: `-meta:a`", () => {
  expectParsed(String.raw`-meta:a`, new ASTNot(new ASTMetatag("meta", "a")));
});

test("QueryParser: `meta:a meta:b`", () => {
  expectParsed(
    String.raw`meta:a meta:b`,
    new ASTAnd(new ASTMetatag("meta", "a"), new ASTMetatag("meta", "b")),
  );
});

test("QueryParser: `~meta:a ~meta:b`", () => {
  expectParsed(
    String.raw`~meta:a ~meta:b`,
    new ASTOr(new ASTMetatag("meta", "a"), new ASTMetatag("meta", "b")),
  );
});

test("QueryParser: `meta:a or meta:b`", () => {
  expectParsed(
    String.raw`meta:a or meta:b`,
    new ASTOr(new ASTMetatag("meta", "a"), new ASTMetatag("meta", "b")),
  );
});

test("QueryParser: `(meta:a)`", () => {
  expectParsed(String.raw`(meta:a)`, new ASTMetatag("meta", "a"));
});

test("QueryParser: `meta:(a)`", () => {
  expectParsed(String.raw`meta:(a)`, new ASTMetatag("meta", "(a)"));
});

test("QueryParser: `(meta:(a)`", () => {
  expectParsed(String.raw`(meta:(a)`, new ASTMetatag("meta", "(a"));
});

test('QueryParser: `meta:"foo bar"`', () => {
  expectParsed(String.raw`meta:"foo bar"`, new ASTMetatag("meta", "foo bar"));
});

test('QueryParser: `meta:foobar"(`', () => {
  expectParsed(String.raw`meta:foobar"(`, new ASTMetatag("meta", 'foobar"('));
});

test("QueryParser: `meta:`", () => {
  expectParsed(String.raw`meta:`, new ASTMetatag("meta", ""));
});

test('QueryParser: `meta:""`', () => {
  expectParsed(String.raw`meta:""`, new ASTMetatag("meta", ""));
});

test('QueryParser: `meta:"\\""`', () => {
  expectParsed(String.raw`meta:"\""`, new ASTMetatag("meta", '"'));
});

test('QueryParser: `meta:"don\'t say \\"lazy\\" okay"`', () => {
  expectParsed(
    String.raw`meta:"don't say \"lazy\" okay"`,
    new ASTMetatag("meta", 'don\'t say "lazy" okay'),
  );
});

test('QueryParser: `(a (meta:"foo)bar"))`', () => {
  expectParsed(
    String.raw`(a (meta:"foo)bar"))`,
    new ASTAnd(new ASTTag("a"), new ASTMetatag("meta", "foo)bar")),
  );
});

test("QueryParser: `meta:'foo bar'`", () => {
  expectParsed(String.raw`meta:'foo bar'`, new ASTMetatag("meta", "foo bar"));
});

test("QueryParser: `meta:foobar'(`", () => {
  expectParsed(String.raw`meta:foobar'(`, new ASTMetatag("meta", "foobar'("));
});

test("QueryParser: `meta:''`", () => {
  expectParsed(String.raw`meta:''`, new ASTMetatag("meta", ""));
});

test("QueryParser: `meta:'\\''`", () => {
  expectParsed(String.raw`meta:'\''`, new ASTMetatag("meta", "'"));
});

test("QueryParser: `meta:'don\\'t say \"lazy\" okay'`", () => {
  expectParsed(
    String.raw`meta:'don\'t say "lazy" okay'`,
    new ASTMetatag("meta", 'don\'t say "lazy" okay'),
  );
});

test("QueryParser: `(a (meta:'foo)bar'))`", () => {
  expectParsed(
    String.raw`(a (source:'foo)bar'))`,
    new ASTAnd(new ASTTag("a"), new ASTTag("source:'foo)bar'")),
  );
});

test("QueryParser: `*`", () => {
  expectParsed(String.raw`*`, new ASTWildcard("*"));
});

test("QueryParser: `*a`", () => {
  expectParsed(String.raw`*a`, new ASTWildcard("*a"));
});

test("QueryParser: `a*`", () => {
  expectParsed(String.raw`a*`, new ASTWildcard("a*"));
});

test("QueryParser: `*a*`", () => {
  expectParsed(String.raw`*a*`, new ASTWildcard("*a*"));
});

test("QueryParser: `a*b`", () => {
  expectParsed(String.raw`a*b`, new ASTWildcard("a*b"));
});

test("QueryParser: `* b`", () => {
  expectParsed(
    String.raw`* b`,
    new ASTAnd(new ASTWildcard("*"), new ASTTag("b")),
  );
});

test("QueryParser: `*a b`", () => {
  expectParsed(
    String.raw`*a b`,
    new ASTAnd(new ASTWildcard("*a"), new ASTTag("b")),
  );
});

test("QueryParser: `a* b`", () => {
  expectParsed(
    String.raw`a* b`,
    new ASTAnd(new ASTWildcard("a*"), new ASTTag("b")),
  );
});

test("QueryParser: `*a* b`", () => {
  expectParsed(
    String.raw`*a* b`,
    new ASTAnd(new ASTWildcard("*a*"), new ASTTag("b")),
  );
});

test("QueryParser: `a *`", () => {
  expectParsed(
    String.raw`a *`,
    new ASTAnd(new ASTTag("a"), new ASTWildcard("*")),
  );
});

test("QueryParser: `a *b`", () => {
  expectParsed(
    String.raw`a *b`,
    new ASTAnd(new ASTTag("a"), new ASTWildcard("*b")),
  );
});

test("QueryParser: `a b*`", () => {
  expectParsed(
    String.raw`a b*`,
    new ASTAnd(new ASTTag("a"), new ASTWildcard("b*")),
  );
});

test("QueryParser: `a *b*`", () => {
  expectParsed(
    String.raw`a *b*`,
    new ASTAnd(new ASTTag("a"), new ASTWildcard("*b*")),
  );
});

test("QueryParser: `a -*`", () => {
  expectParsed(
    String.raw`a -*`,
    new ASTAnd(new ASTTag("a"), new ASTNot(new ASTWildcard("*"))),
  );
});

test("QueryParser: `a -b*`", () => {
  expectParsed(
    String.raw`a -b*`,
    new ASTAnd(new ASTTag("a"), new ASTNot(new ASTWildcard("b*"))),
  );
});

test("QueryParser: `a -*b`", () => {
  expectParsed(
    String.raw`a -*b`,
    new ASTAnd(new ASTTag("a"), new ASTNot(new ASTWildcard("*b"))),
  );
});

test("QueryParser: `a -*b*`", () => {
  expectParsed(
    String.raw`a -*b*`,
    new ASTAnd(new ASTTag("a"), new ASTNot(new ASTWildcard("*b*"))),
  );
});

test("QueryParser: `~a ~*`", () => {
  expectParsed(
    String.raw`~a ~*`,
    new ASTOr(new ASTTag("a"), new ASTWildcard("*")),
  );
});

test("QueryParser: `~* ~a`", () => {
  expectParsed(
    String.raw`~* ~a`,
    new ASTOr(new ASTWildcard("*"), new ASTTag("a")),
  );
});

test("QueryParser: `~a ~*a`", () => {
  expectParsed(
    String.raw`~a ~*a`,
    new ASTOr(new ASTTag("a"), new ASTWildcard("*a")),
  );
});

test("QueryParser: `~*a ~a`", () => {
  expectParsed(
    String.raw`~*a ~a`,
    new ASTOr(new ASTWildcard("*a"), new ASTTag("a")),
  );
});

test("QueryParser: `a or a*`", () => {
  expectParsed(
    String.raw`a or a*`,
    new ASTOr(new ASTTag("a"), new ASTWildcard("a*")),
  );
});

test("QueryParser: `a and a*`", () => {
  expectParsed(
    String.raw`a and a*`,
    new ASTAnd(new ASTTag("a"), new ASTWildcard("a*")),
  );
});

test("QueryParser: `a* b*`", () => {
  expectParsed(
    String.raw`a* b*`,
    new ASTAnd(new ASTWildcard("a*"), new ASTWildcard("b*")),
  );
});

test("QueryParser: `a* or b*`", () => {
  expectParsed(
    String.raw`a* or b*`,
    new ASTOr(new ASTWildcard("a*"), new ASTWildcard("b*")),
  );
});

test("QueryParser: `a b* c`", () => {
  expectParsed(
    String.raw`a b* c`,
    new ASTAnd(
      new ASTTag("a"),
      new ASTAnd(new ASTWildcard("b*"), new ASTTag("c")),
    ),
  );
});

test("QueryParser: `a -* c`", () => {
  expectParsed(
    String.raw`a -* c`,
    new ASTAnd(
      new ASTTag("a"),
      new ASTAnd(new ASTNot(new ASTWildcard("*")), new ASTTag("c")),
    ),
  );
});

test("QueryParser: `a`", () => {
  expectParsed(String.raw`a`, new ASTTag("a"));
});

test("QueryParser: `a `", () => {
  expectParsed(String.raw`a `, new ASTTag("a"));
});

test("QueryParser: ` a`", () => {
  expectParsed(String.raw` a`, new ASTTag("a"));
});

test("QueryParser: ` a `", () => {
  expectParsed(String.raw` a `, new ASTTag("a"));
});

test("QueryParser: `(a)`", () => {
  expectParsed(String.raw`(a)`, new ASTTag("a"));
});

test("QueryParser: `( a)`", () => {
  expectParsed(String.raw`( a)`, new ASTTag("a"));
});

test("QueryParser: `(a )`", () => {
  expectParsed(String.raw`(a )`, new ASTTag("a"));
});

test("QueryParser: ` ( a ) `", () => {
  expectParsed(String.raw` ( a ) `, new ASTTag("a"));
});

test("QueryParser: `((a))`", () => {
  expectParsed(String.raw`((a))`, new ASTTag("a"));
});

test("QueryParser: `( ( a ) )`", () => {
  expectParsed(String.raw`( ( a ) )`, new ASTTag("a"));
});

test("QueryParser: ` ( ( a ) ) `", () => {
  expectParsed(String.raw` ( ( a ) ) `, new ASTTag("a"));
});

test("QueryParser: `a b`", () => {
  expectParsed(String.raw`a b`, new ASTAnd(new ASTTag("a"), new ASTTag("b")));
});

test("QueryParser: `(a b)`", () => {
  expectParsed(String.raw`(a b)`, new ASTAnd(new ASTTag("a"), new ASTTag("b")));
});

test("QueryParser: `a (b)`", () => {
  expectParsed(String.raw`a (b)`, new ASTAnd(new ASTTag("a"), new ASTTag("b")));
});

test("QueryParser: `(a) b`", () => {
  expectParsed(String.raw`(a) b`, new ASTAnd(new ASTTag("a"), new ASTTag("b")));
});

test("QueryParser: `(a) (b)`", () => {
  expectParsed(
    String.raw`(a) (b)`,
    new ASTAnd(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `((a) (b))`", () => {
  expectParsed(
    String.raw`((a) (b))`,
    new ASTAnd(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `a b c`", () => {
  expectParsed(
    String.raw`a b c`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `(a b) c`", () => {
  expectParsed(
    String.raw`(a b) c`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `((a) b) c`", () => {
  expectParsed(
    String.raw`((a) b) c`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `(((a) b) c)`", () => {
  expectParsed(
    String.raw`(((a) b) c)`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `((a b) c)`", () => {
  expectParsed(
    String.raw`((a b) c)`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `((a) (b) (c))`", () => {
  expectParsed(
    String.raw`((a) (b) (c))`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `a (b c)`", () => {
  expectParsed(
    String.raw`a (b c)`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `a (b (c))`", () => {
  expectParsed(
    String.raw`a (b (c))`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `(a (b (c)))`", () => {
  expectParsed(
    String.raw`(a (b (c)))`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `(a (b c))`", () => {
  expectParsed(
    String.raw`(a (b c))`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `(a b c)`", () => {
  expectParsed(
    String.raw`(a b c)`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `a and b`", () => {
  expectParsed(
    String.raw`a and b`,
    new ASTAnd(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `a AND b`", () => {
  expectParsed(
    String.raw`a AND b`,
    new ASTAnd(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `(a and b)`", () => {
  expectParsed(
    String.raw`(a and b)`,
    new ASTAnd(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `a and b and c`", () => {
  expectParsed(
    String.raw`a and b and c`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `(a and b) and c`", () => {
  expectParsed(
    String.raw`(a and b) and c`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `a and (b and c)`", () => {
  expectParsed(
    String.raw`a and (b and c)`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `(a and b and c)`", () => {
  expectParsed(
    String.raw`(a and b and c)`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `a or b`", () => {
  expectParsed(String.raw`a or b`, new ASTOr(new ASTTag("a"), new ASTTag("b")));
});

test("QueryParser: `a OR b`", () => {
  expectParsed(String.raw`a OR b`, new ASTOr(new ASTTag("a"), new ASTTag("b")));
});

test("QueryParser: `(a or b)`", () => {
  expectParsed(
    String.raw`(a or b)`,
    new ASTOr(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `(a) or (b)`", () => {
  expectParsed(
    String.raw`(a) or (b)`,
    new ASTOr(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `a or b or c`", () => {
  expectParsed(
    String.raw`a or b or c`,
    new ASTOr(new ASTTag("a"), new ASTOr(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `(a or b) or c`", () => {
  expectParsed(
    String.raw`(a or b) or c`,
    new ASTOr(new ASTTag("a"), new ASTOr(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `a or (b or c)`", () => {
  expectParsed(
    String.raw`a or (b or c)`,
    new ASTOr(new ASTTag("a"), new ASTOr(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `(a or b or c)`", () => {
  expectParsed(
    String.raw`(a or b or c)`,
    new ASTOr(new ASTTag("a"), new ASTOr(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `a or (b or (c or d))`", () => {
  expectParsed(
    String.raw`a or (b or (c or d))`,
    new ASTOr(
      new ASTTag("a"),
      new ASTOr(new ASTTag("b"), new ASTOr(new ASTTag("c"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: `((a or b) or c) or d`", () => {
  expectParsed(
    String.raw`((a or b) or c) or d`,
    new ASTOr(
      new ASTTag("a"),
      new ASTOr(new ASTTag("b"), new ASTOr(new ASTTag("c"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: `(a or b) or (c or d)`", () => {
  expectParsed(
    String.raw`(a or b) or (c or d)`,
    new ASTOr(
      new ASTTag("a"),
      new ASTOr(new ASTTag("b"), new ASTOr(new ASTTag("c"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: `~a ~b`", () => {
  expectParsed(String.raw`~a ~b`, new ASTOr(new ASTTag("a"), new ASTTag("b")));
});

test("QueryParser: `~a ~b ~c`", () => {
  expectParsed(
    String.raw`~a ~b ~c`,
    new ASTOr(new ASTTag("a"), new ASTOr(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `~a ~b ~c ~d`", () => {
  expectParsed(
    String.raw`~a ~b ~c ~d`,
    new ASTOr(
      new ASTTag("a"),
      new ASTOr(new ASTTag("b"), new ASTOr(new ASTTag("c"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: `~a`", () => {
  expectParsed(String.raw`~a`, new ASTTag("a"));
});

test("QueryParser: `(~a)`", () => {
  expectParsed(String.raw`(~a)`, new ASTTag("a"));
});

test("QueryParser: `~(a)`", () => {
  expectParsed(String.raw`~(a)`, new ASTTag("a"));
});

test("QueryParser: `~(~a)`", () => {
  expectParsed(String.raw`~(~a)`, new ASTTag("a"));
});

test("QueryParser: `~(~(~a))`", () => {
  expectParsed(String.raw`~(~(~a))`, new ASTTag("a"));
});

test("QueryParser: `~(-a)`", () => {
  expectParsed(String.raw`~(-a)`, new ASTNot(new ASTTag("a")));
});

test("QueryParser: `-(~a)`", () => {
  expectParsed(String.raw`-(~a)`, new ASTNot(new ASTTag("a")));
});

test("QueryParser: `-(~(-(~a)))`", () => {
  expectParsed(String.raw`-(~(-(~a)))`, new ASTTag("a"));
});

test("QueryParser: `~(-(~(-a)))`", () => {
  expectParsed(String.raw`~(-(~(-a)))`, new ASTTag("a"));
});

test("QueryParser: `a ~b`", () => {
  expectParsed(String.raw`a ~b`, new ASTAnd(new ASTTag("a"), new ASTTag("b")));
});

test("QueryParser: `~a b`", () => {
  expectParsed(String.raw`~a b`, new ASTAnd(new ASTTag("b"), new ASTTag("a")));
});

test("QueryParser: `((a) ~b)`", () => {
  expectParsed(
    String.raw`((a) ~b)`,
    new ASTAnd(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `~(a b)`", () => {
  expectParsed(
    String.raw`~(a b)`,
    new ASTAnd(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `~a and ~b`", () => {
  expectParsed(
    String.raw`~a and ~b`,
    new ASTAnd(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `~a or ~b`", () => {
  expectParsed(
    String.raw`~a or ~b`,
    new ASTOr(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `~(-a) or ~(-b)`", () => {
  expectParsed(
    String.raw`~(-a) or ~(-b)`,
    new ASTOr(new ASTNot(new ASTTag("a")), new ASTNot(new ASTTag("b"))),
  );
});

test("QueryParser: `~(a) ~(b)`", () => {
  expectParsed(
    String.raw`~(a) ~(b)`,
    new ASTOr(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `(~a) (~b)`", () => {
  expectParsed(
    String.raw`(~a) (~b)`,
    new ASTAnd(new ASTTag("a"), new ASTTag("b")),
  );
});

test("QueryParser: `(~a) ~b ~c`", () => {
  expectParsed(
    String.raw`(~a) ~b ~c`,
    new ASTAnd(new ASTTag("a"), new ASTOr(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `~a (~b ~c)`", () => {
  expectParsed(
    String.raw`~a (~b ~c)`,
    new ASTAnd(new ASTOr(new ASTTag("b"), new ASTTag("c")), new ASTTag("a")),
  );
});

test("QueryParser: `~a ~b or ~c ~d`", () => {
  expectParsed(
    String.raw`~a ~b or ~c ~d`,
    new ASTOr(
      new ASTTag("a"),
      new ASTOr(new ASTTag("b"), new ASTOr(new ASTTag("c"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: `~a ~b and ~c ~d`", () => {
  expectParsed(
    String.raw`~a ~b and ~c ~d`,
    new ASTAnd(
      new ASTOr(new ASTTag("a"), new ASTTag("b")),
      new ASTOr(new ASTTag("c"), new ASTTag("d")),
    ),
  );
});

test("QueryParser: `(~a ~b) (~c ~d)`", () => {
  expectParsed(
    String.raw`(~a ~b) (~c ~d)`,
    new ASTAnd(
      new ASTOr(new ASTTag("a"), new ASTTag("b")),
      new ASTOr(new ASTTag("c"), new ASTTag("d")),
    ),
  );
});

test("QueryParser: `~(a b) ~(c d)`", () => {
  expectParsed(
    String.raw`~(a b) ~(c d)`,
    new ASTOr(
      new ASTAnd(new ASTTag("a"), new ASTTag("b")),
      new ASTAnd(new ASTTag("c"), new ASTTag("d")),
    ),
  );
});

test("QueryParser: `(a b) or (c d)`", () => {
  expectParsed(
    String.raw`(a b) or (c d)`,
    new ASTOr(
      new ASTAnd(new ASTTag("a"), new ASTTag("b")),
      new ASTAnd(new ASTTag("c"), new ASTTag("d")),
    ),
  );
});

test("QueryParser: ` a  b  c  d`", () => {
  expectParsed(
    String.raw` a  b  c  d`,
    new ASTAnd(
      new ASTTag("a"),
      new ASTAnd(new ASTTag("b"), new ASTAnd(new ASTTag("c"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: ` a  b  c ~d`", () => {
  expectParsed(
    String.raw` a  b  c ~d`,
    new ASTAnd(
      new ASTTag("a"),
      new ASTAnd(new ASTTag("b"), new ASTAnd(new ASTTag("c"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: ` a  b ~c  d`", () => {
  expectParsed(
    String.raw` a  b ~c  d`,
    new ASTAnd(
      new ASTTag("a"),
      new ASTAnd(new ASTTag("b"), new ASTAnd(new ASTTag("d"), new ASTTag("c"))),
    ),
  );
});

test("QueryParser: ` a  b ~c ~d`", () => {
  expectParsed(
    String.raw` a  b ~c ~d`,
    new ASTAnd(
      new ASTTag("a"),
      new ASTAnd(new ASTTag("b"), new ASTOr(new ASTTag("c"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: ` a ~b  c  d`", () => {
  expectParsed(
    String.raw` a ~b  c  d`,
    new ASTAnd(
      new ASTTag("a"),
      new ASTAnd(new ASTTag("c"), new ASTAnd(new ASTTag("d"), new ASTTag("b"))),
    ),
  );
});

test("QueryParser: ` a ~b  c ~d`", () => {
  expectParsed(
    String.raw` a ~b  c ~d`,
    new ASTAnd(
      new ASTTag("a"),
      new ASTAnd(new ASTTag("c"), new ASTOr(new ASTTag("b"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: ` a ~b ~c  d`", () => {
  expectParsed(
    String.raw` a ~b ~c  d`,
    new ASTAnd(
      new ASTTag("a"),
      new ASTAnd(new ASTTag("d"), new ASTOr(new ASTTag("b"), new ASTTag("c"))),
    ),
  );
});

test("QueryParser: ` a ~b ~c ~d`", () => {
  expectParsed(
    String.raw` a ~b ~c ~d`,
    new ASTAnd(
      new ASTTag("a"),
      new ASTOr(new ASTTag("b"), new ASTOr(new ASTTag("c"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: `~a  b  c  d`", () => {
  expectParsed(
    String.raw`~a  b  c  d`,
    new ASTAnd(
      new ASTTag("b"),
      new ASTAnd(new ASTTag("c"), new ASTAnd(new ASTTag("d"), new ASTTag("a"))),
    ),
  );
});

test("QueryParser: `~a  b  c ~d`", () => {
  expectParsed(
    String.raw`~a  b  c ~d`,
    new ASTAnd(
      new ASTTag("b"),
      new ASTAnd(new ASTTag("c"), new ASTOr(new ASTTag("a"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: `~a  b ~c  d`", () => {
  expectParsed(
    String.raw`~a  b ~c  d`,
    new ASTAnd(
      new ASTTag("b"),
      new ASTAnd(new ASTTag("d"), new ASTOr(new ASTTag("a"), new ASTTag("c"))),
    ),
  );
});

test("QueryParser: `~a  b ~c ~d`", () => {
  expectParsed(
    String.raw`~a  b ~c ~d`,
    new ASTAnd(
      new ASTTag("b"),
      new ASTOr(new ASTTag("a"), new ASTOr(new ASTTag("c"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: `~a ~b  c  d`", () => {
  expectParsed(
    String.raw`~a ~b  c  d`,
    new ASTAnd(
      new ASTTag("c"),
      new ASTAnd(new ASTTag("d"), new ASTOr(new ASTTag("a"), new ASTTag("b"))),
    ),
  );
});

test("QueryParser: `~a ~b  c ~d`", () => {
  expectParsed(
    String.raw`~a ~b  c ~d`,
    new ASTAnd(
      new ASTTag("c"),
      new ASTOr(new ASTTag("a"), new ASTOr(new ASTTag("b"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: `~a ~b ~c  d`", () => {
  expectParsed(
    String.raw`~a ~b ~c  d`,
    new ASTAnd(
      new ASTTag("d"),
      new ASTOr(new ASTTag("a"), new ASTOr(new ASTTag("b"), new ASTTag("c"))),
    ),
  );
});

test("QueryParser: `~a ~b ~c ~d`", () => {
  expectParsed(
    String.raw`~a ~b ~c ~d`,
    new ASTOr(
      new ASTTag("a"),
      new ASTOr(new ASTTag("b"), new ASTOr(new ASTTag("c"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: `-a`", () => {
  expectParsed(String.raw`-a`, new ASTNot(new ASTTag("a")));
});

test("QueryParser: `(a -b)`", () => {
  expectParsed(
    String.raw`(a -b)`,
    new ASTAnd(new ASTTag("a"), new ASTNot(new ASTTag("b"))),
  );
});

test("QueryParser: `a (-b)`", () => {
  expectParsed(
    String.raw`a (-b)`,
    new ASTAnd(new ASTTag("a"), new ASTNot(new ASTTag("b"))),
  );
});

test("QueryParser: `((a) -b)`", () => {
  expectParsed(
    String.raw`((a) -b)`,
    new ASTAnd(new ASTTag("a"), new ASTNot(new ASTTag("b"))),
  );
});

test("QueryParser: `-a`", () => {
  expectParsed(String.raw`-a`, new ASTNot(new ASTTag("a")));
});

test("QueryParser: `-(-(-a))`", () => {
  expectParsed(String.raw`-(-(-a))`, new ASTNot(new ASTTag("a")));
});

test("QueryParser: `-(-a)`", () => {
  expectParsed(String.raw`-(-a)`, new ASTTag("a"));
});

test("QueryParser: `-(-(-(-a)))`", () => {
  expectParsed(String.raw`-(-(-(-a)))`, new ASTTag("a"));
});

test("QueryParser: `a -(-(b)) c`", () => {
  expectParsed(
    String.raw`a -(-(b)) c`,
    new ASTAnd(new ASTTag("a"), new ASTAnd(new ASTTag("b"), new ASTTag("c"))),
  );
});

test("QueryParser: `a -(-(b -(-c))) d`", () => {
  expectParsed(
    String.raw`a -(-(b -(-c))) d`,
    new ASTAnd(
      new ASTTag("a"),
      new ASTAnd(new ASTTag("b"), new ASTAnd(new ASTTag("c"), new ASTTag("d"))),
    ),
  );
});

test("QueryParser: `(`", () => {
  expectParsed(String.raw`(`, new ASTNone());
});

test("QueryParser: `)`", () => {
  expectParsed(String.raw`)`, new ASTNone());
});

test("QueryParser: `-`", () => {
  expectParsed(String.raw`-`, new ASTNone());
});

test("QueryParser: `~`", () => {
  expectParsed(String.raw`~`, new ASTNone());
});

test("QueryParser: `(a`", () => {
  expectParsed(String.raw`(a`, new ASTNone());
});

test("QueryParser: `)a`", () => {
  expectParsed(String.raw`)a`, new ASTNone());
});

test("QueryParser: `-~a`", () => {
  expectParsed(String.raw`-~a`, new ASTNone());
});

test("QueryParser: `~-a`", () => {
  expectParsed(String.raw`~-a`, new ASTNone());
});

test("QueryParser: `~~a`", () => {
  expectParsed(String.raw`~~a`, new ASTNone());
});

test("QueryParser: `--a`", () => {
  expectParsed(String.raw`--a`, new ASTNone());
});

test("QueryParser: `and`", () => {
  expectParsed(String.raw`and`, new ASTNone());
});

test("QueryParser: `-and`", () => {
  expectParsed(String.raw`-and`, new ASTNone());
});

test("QueryParser: `~and`", () => {
  expectParsed(String.raw`~and`, new ASTNone());
});

test("QueryParser: `or`", () => {
  expectParsed(String.raw`or`, new ASTNone());
});

test("QueryParser: `-or`", () => {
  expectParsed(String.raw`-or`, new ASTNone());
});

test("QueryParser: `~or`", () => {
  expectParsed(String.raw`~or`, new ASTNone());
});

test("QueryParser: `a and`", () => {
  expectParsed(String.raw`a and`, new ASTNone());
});

test("QueryParser: `a or`", () => {
  expectParsed(String.raw`a or`, new ASTNone());
});

test("QueryParser: `and a`", () => {
  expectParsed(String.raw`and a`, new ASTNone());
});

test("QueryParser: `or a`", () => {
  expectParsed(String.raw`or a`, new ASTNone());
});

test("QueryParser: `a -`", () => {
  expectParsed(String.raw`a -`, new ASTNone());
});

test("QueryParser: `a ~`", () => {
  expectParsed(String.raw`a ~`, new ASTNone());
});

test("QueryParser: `(a b`", () => {
  expectParsed(String.raw`(a b`, new ASTNone());
});

test("QueryParser: `(a (b)`", () => {
  expectParsed(String.raw`(a (b)`, new ASTNone());
});

test('QueryParser: `meta:"foo`', () => {
  expectParsed(String.raw`meta:"foo`, new ASTNone());
});

test('QueryParser: `meta:"foo bar`', () => {
  expectParsed(String.raw`meta:"foo bar`, new ASTNone());
});
