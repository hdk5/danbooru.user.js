import { Range } from "../src/Range";

test("RangeEq", () => {
  const range = Range.parse("5");
  expect(range).not.toBeNull();
  expect(range!.includes(4)).toBeFalsy();
  expect(range!.includes(5)).toBeTruthy();
  expect(range!.includes(6)).toBeFalsy();
});

test("RangeGt (>)", () => {
  const range = Range.parse(">5");
  expect(range).not.toBeNull();
  expect(range!.includes(4)).toBeFalsy();
  expect(range!.includes(5)).toBeFalsy();
  expect(range!.includes(6)).toBeTruthy();
});

test("RangeGtEq (>=)", () => {
  const range = Range.parse(">=5");
  expect(range).not.toBeNull();
  expect(range!.includes(4)).toBeFalsy();
  expect(range!.includes(5)).toBeTruthy();
  expect(range!.includes(6)).toBeTruthy();
});

test("RangeLt (<)", () => {
  const range = Range.parse("<5");
  expect(range).not.toBeNull();
  expect(range!.includes(4)).toBeTruthy();
  expect(range!.includes(5)).toBeFalsy();
  expect(range!.includes(6)).toBeFalsy();
});

test("RangeLtEq (<=)", () => {
  const range = Range.parse("<=5");
  expect(range).not.toBeNull();
  expect(range!.includes(4)).toBeTruthy();
  expect(range!.includes(5)).toBeTruthy();
  expect(range!.includes(6)).toBeFalsy();
});

test("RangeLtEq (..)", () => {
  const range = Range.parse("..5");
  expect(range).not.toBeNull();
  expect(range!.includes(4)).toBeTruthy();
  expect(range!.includes(5)).toBeTruthy();
  expect(range!.includes(6)).toBeFalsy();
});

test("RangeGtEq (..)", () => {
  const range = Range.parse("5..");
  expect(range).not.toBeNull();
  expect(range!.includes(4)).toBeFalsy();
  expect(range!.includes(5)).toBeTruthy();
  expect(range!.includes(6)).toBeTruthy();
});

test("RangeInclusive (..)", () => {
  const range = Range.parse("4..6");
  expect(range).not.toBeNull();
  expect(range!.includes(3)).toBeFalsy();
  expect(range!.includes(4)).toBeTruthy();
  expect(range!.includes(5)).toBeTruthy();
  expect(range!.includes(6)).toBeTruthy();
  expect(range!.includes(7)).toBeFalsy();
});

test("RangeExclusive (...)", () => {
  const range = Range.parse("4...6");
  expect(range).not.toBeNull();
  expect(range!.includes(3)).toBeFalsy();
  expect(range!.includes(4)).toBeTruthy();
  expect(range!.includes(5)).toBeTruthy();
  expect(range!.includes(6)).toBeFalsy();
  expect(range!.includes(7)).toBeFalsy();
});

test("RangeIn (,)", () => {
  const range = Range.parse("3,5,7");
  expect(range).not.toBeNull();
  expect(range!.includes(2)).toBeFalsy();
  expect(range!.includes(3)).toBeTruthy();
  expect(range!.includes(4)).toBeFalsy();
  expect(range!.includes(5)).toBeTruthy();
  expect(range!.includes(6)).toBeFalsy();
  expect(range!.includes(7)).toBeTruthy();
  expect(range!.includes(8)).toBeFalsy();
});

test("RangeUnion (,)", () => {
  const range = Range.parse("3,5..7");
  expect(range).not.toBeNull();
  expect(range!.includes(2)).toBeFalsy();
  expect(range!.includes(3)).toBeTruthy();
  expect(range!.includes(4)).toBeFalsy();
  expect(range!.includes(5)).toBeTruthy();
  expect(range!.includes(6)).toBeTruthy();
  expect(range!.includes(7)).toBeTruthy();
  expect(range!.includes(8)).toBeFalsy();
});
