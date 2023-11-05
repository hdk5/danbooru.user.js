/* eslint-disable test/prefer-lowercase-title */
import { Range } from '../src/Range'

it('RangeEq', () => {
  const range = Range.parse('5')
  expect(range).not.toBeNull()
  expect(range!.includes(4)).toBeFalsy()
  expect(range!.includes(5)).toBeTruthy()
  expect(range!.includes(6)).toBeFalsy()
})

it('RangeGt (>)', () => {
  const range = Range.parse('>5')
  expect(range).not.toBeNull()
  expect(range!.includes(4)).toBeFalsy()
  expect(range!.includes(5)).toBeFalsy()
  expect(range!.includes(6)).toBeTruthy()
})

it('RangeGtEq (>=)', () => {
  const range = Range.parse('>=5')
  expect(range).not.toBeNull()
  expect(range!.includes(4)).toBeFalsy()
  expect(range!.includes(5)).toBeTruthy()
  expect(range!.includes(6)).toBeTruthy()
})

it('RangeLt (<)', () => {
  const range = Range.parse('<5')
  expect(range).not.toBeNull()
  expect(range!.includes(4)).toBeTruthy()
  expect(range!.includes(5)).toBeFalsy()
  expect(range!.includes(6)).toBeFalsy()
})

it('RangeLtEq (<=)', () => {
  const range = Range.parse('<=5')
  expect(range).not.toBeNull()
  expect(range!.includes(4)).toBeTruthy()
  expect(range!.includes(5)).toBeTruthy()
  expect(range!.includes(6)).toBeFalsy()
})

it('RangeLtEq (..)', () => {
  const range = Range.parse('..5')
  expect(range).not.toBeNull()
  expect(range!.includes(4)).toBeTruthy()
  expect(range!.includes(5)).toBeTruthy()
  expect(range!.includes(6)).toBeFalsy()
})

it('RangeGtEq (..)', () => {
  const range = Range.parse('5..')
  expect(range).not.toBeNull()
  expect(range!.includes(4)).toBeFalsy()
  expect(range!.includes(5)).toBeTruthy()
  expect(range!.includes(6)).toBeTruthy()
})

it('RangeInclusive (..)', () => {
  const range = Range.parse('4..6')
  expect(range).not.toBeNull()
  expect(range!.includes(3)).toBeFalsy()
  expect(range!.includes(4)).toBeTruthy()
  expect(range!.includes(5)).toBeTruthy()
  expect(range!.includes(6)).toBeTruthy()
  expect(range!.includes(7)).toBeFalsy()
})

it('RangeExclusive (...)', () => {
  const range = Range.parse('4...6')
  expect(range).not.toBeNull()
  expect(range!.includes(3)).toBeFalsy()
  expect(range!.includes(4)).toBeTruthy()
  expect(range!.includes(5)).toBeTruthy()
  expect(range!.includes(6)).toBeFalsy()
  expect(range!.includes(7)).toBeFalsy()
})

it('RangeIn (,)', () => {
  const range = Range.parse('3,5,7')
  expect(range).not.toBeNull()
  expect(range!.includes(2)).toBeFalsy()
  expect(range!.includes(3)).toBeTruthy()
  expect(range!.includes(4)).toBeFalsy()
  expect(range!.includes(5)).toBeTruthy()
  expect(range!.includes(6)).toBeFalsy()
  expect(range!.includes(7)).toBeTruthy()
  expect(range!.includes(8)).toBeFalsy()
})

it('RangeUnion (,)', () => {
  const range = Range.parse('3,5..7')
  expect(range).not.toBeNull()
  expect(range!.includes(2)).toBeFalsy()
  expect(range!.includes(3)).toBeTruthy()
  expect(range!.includes(4)).toBeFalsy()
  expect(range!.includes(5)).toBeTruthy()
  expect(range!.includes(6)).toBeTruthy()
  expect(range!.includes(7)).toBeTruthy()
  expect(range!.includes(8)).toBeFalsy()
})
