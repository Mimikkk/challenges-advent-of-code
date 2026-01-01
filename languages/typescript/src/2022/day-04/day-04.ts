import { Puzzle } from '../../types/puzzle.ts';
import { countBy } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

type Range = [from: number, to: number];
const hasFullOverlap = ([aFrom, aTo]: Range, [bFrom, bTo]: Range) => {
  if (aFrom <= bFrom && aTo >= bTo) return true;
  if (bFrom <= aFrom && bTo >= aTo) return true;
  return false;
};

const hasAnyOverlap = ([aFrom, aTo]: Range, [bFrom, bTo]: Range) => {
  if (aFrom <= bFrom && aTo >= bFrom) return true;
  if (bFrom <= aFrom && bTo >= aFrom) return true;
  return false;
};

export default Puzzle.new({
  prepare: (content) =>
    Str.lines(content).map((s) => s.split(',').map((s) => s.split('-').map(Number))) as [Range, Range][],
  easy: (ranges) => countBy(ranges, ([a, b]) => hasFullOverlap(a, b)),
  hard: (ranges) => countBy(ranges, ([a, b]) => hasAnyOverlap(a, b)),
});
