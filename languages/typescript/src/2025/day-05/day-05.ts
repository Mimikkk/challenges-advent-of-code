import { Puzzle } from '../../types/puzzle.ts';
import { sumBy } from '../../utils/maths.ts';

export default Puzzle.new({
  prepare: (content) => {
    const [freshRangesStr, availableIdsStr] = content.split('\n\n');

    const freshRanges = freshRangesStr.split('\n').map((range) => range.split('-').map(Number));
    const availableIds = availableIdsStr.split('\n').map(Number);

    return { freshRanges, availableIds };
  },
  easy({ availableIds, freshRanges }) {
    return availableIds.filter((id) => freshRanges.some(([start, end]) => id >= start && id <= end)).length;
  },
  hard({ freshRanges }) {
    const sortedRanges = freshRanges.slice().sort(([aStart], [bStart]) => aStart - bStart);
    const merged: [number, number][] = [];

    for (const [start, end] of sortedRanges) {
      if (merged.length === 0 || merged[merged.length - 1][1] < start - 1) {
        merged.push([start, end]);
      } else {
        merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);
      }
    }

    return sumBy(merged, ([start, end]) => end - start + 1);
  },
});
