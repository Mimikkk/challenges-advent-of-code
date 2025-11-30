import { Puzzle } from '../../types/puzzle.ts';
import { sum } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

const isDigitChar = (value: string): boolean => '0' <= value && value <= '9';
const findDigitCharValue = (str: string, startAt: number): number | undefined => {
  if (!isDigitChar(str[startAt])) return undefined;
  return +str[startAt];
};

const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'] as const;
const findDigitWordValue = (str: string, startAt: number): number | undefined => {
  outer: for (let i = 0, it = digits.length; i < it; ++i) {
    const word = digits[i];
    if (startAt + word.length > str.length) continue;

    for (let j = 0, jt = word.length; j < jt; ++j) {
      if (str[startAt + j] !== word[j]) continue outer;
    }

    return i + 1;
  }

  return undefined;
};

export default Puzzle.new({
  prepare: Str.lines,
  easy: (strs) =>
    sum(strs.map((str) => {
      let first: number | undefined;
      let last: number | undefined;

      for (let i = 0, it = str.length; i < it; ++i) {
        const value = findDigitCharValue(str, i);

        if (value === undefined) continue;
        if (first === undefined) {
          first = value;
          last = first;
        } else {
          last = value;
        }
      }

      if (first === undefined || last === undefined) return 0;
      return first * 10 + last;
    })),
  hard: (strs) =>
    sum(strs.map((str) => {
      let first: number | undefined;
      let last: number | undefined;

      for (let i = 0, it = str.length; i < it; ++i) {
        const value = findDigitCharValue(str, i) ?? findDigitWordValue(str, i);

        if (value === undefined) continue;
        if (first === undefined) {
          first = value;
          last = first;
        } else {
          last = value;
        }
      }

      if (first === undefined || last === undefined) return 0;
      return first * 10 + last;
    })),
});
