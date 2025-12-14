import { Puzzle } from '../../types/puzzle.ts';
import { countBy, sumBy } from '../../utils/maths.ts';

export default Puzzle.new({
  prepare(content) {
    const strs = content.split('\n\n');

    const regions = strs.pop()!.trim().split('\n').map((str) => str.split(': ')).map(
      ([sizeStr, tileCountsStr]) => {
        const [width, height] = sizeStr.split('x').map(Number);
        const tileCounts = tileCountsStr.split(' ').map(Number);

        return { area: width * height, tileCounts };
      },
    );

    const tileSizes = strs.map((str) =>
      sumBy(
        str.trim().split(':\n')[1].split('\n').flatMap((row) => row.split('')),
        (r) => r === '#' ? 1 : 0,
      )
    );

    return { regions, tileSizes };
  },
  easy({ regions, tileSizes }) {
    return countBy(regions, ({ area, tileCounts }) => {
      let used = 0;

      for (let i = 0, it = Math.min(tileCounts.length, tileSizes.length); i < it; ++i) {
        used += tileCounts[i] * tileSizes[i];
      }

      return area - used >= 0;
    });
  },
});
