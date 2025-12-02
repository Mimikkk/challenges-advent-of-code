import { Puzzle } from '../../types/puzzle.ts';

type Range = [firstId: number, lastId: number];
const parseRanges = (line: string): Range[] => line.split(',').map((range) => range.split('-').map(Number)) as Range[];

const sumRangesBy = (ranges: Range[], predicate: (id: number) => boolean): number => {
  let result = 0;

  for (const [firstId, lastId] of ranges) {
    for (let id = firstId; id <= lastId; ++id) {
      if (!predicate(id)) continue;
      result += id;
    }
  }

  return result;
};

export default Puzzle.new({
  prepare: parseRanges,
  easy(ranges) {
    return sumRangesBy(ranges, (id) => {
      const str = id.toString();
      const len = str.length;
      if (len % 2 !== 0) return false;

      for (let i = 0, it = len / 2; i < it; ++i) {
        if (str[i] === str[it + i]) continue;
        return false;
      }

      return true;
    });
  },
  hard(ranges) {
    return sumRangesBy(ranges, (id) => {
      const str = id.toString();
      const len = str.length;

      outer: for (let size = 1, it = Math.floor(len / 2); size <= it; ++size) {
        if (len % size !== 0) continue;

        for (let i = size; i < len; ++i) {
          if (str[i] !== str[i % size]) continue outer;
        }

        return true;
      }

      return false;
    });
  },
});
