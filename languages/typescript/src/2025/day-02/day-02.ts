import { Puzzle } from '../../types/puzzle.ts';
import { sum } from '../../utils/maths.ts';

type Range = [firstId: number, lastId: number];
const parseRanges = (line: string): Range[] => line.split(',').map((range) => range.split('-').map(Number)) as Range[];

const sumInvalidIds = (ranges: Range[], isValid: (id: number) => boolean): number => {
  const invalidIds: number[] = [];

  for (const [firstId, lastId] of ranges) {
    for (let id = firstId; id <= lastId; ++id) {
      if (isValid(id)) continue;
      invalidIds.push(id);
    }
  }

  return sum(invalidIds);
};

export default Puzzle.new({
  prepare: parseRanges,
  easy(ranges) {
    return sumInvalidIds(ranges, (id) => {
      const str = id.toString();
      const len = str.length;
      if (len % 2 !== 0) return true;

      const mid = len / 2;
      for (let i = 0; i < mid; ++i) {
        if (str[i] !== str[mid + i]) {
          return true;
        }
      }

      return false;
    });
  },
  hard(ranges) {
    return sumInvalidIds(ranges, (id) => {
      const str = id.toString();
      const len = str.length;

      for (let size = 1; size <= Math.floor(len / 2); ++size) {
        if (len % size !== 0) continue;

        const pattern = str.slice(0, size);

        let repeated = '';
        for (let i = 0; i < len / size; ++i) {
          repeated += pattern;
        }

        if (repeated === str) return false;
      }
      return true;
    });
  },
});
