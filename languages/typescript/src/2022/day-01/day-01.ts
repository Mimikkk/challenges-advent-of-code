import { Puzzle } from '../../types/puzzle.ts';
import { desc, identity, maxBy, sum } from '../../utils/maths.ts';

export default Puzzle.new({
  prepare(content): number[] {
    const elfStrs = content.split('\n\n');
    return elfStrs.map((elfStr) => elfStr.split('\n').map(Number)).map(sum);
  },
  easy(elves) {
    return maxBy(elves, identity);
  },
  hard(elves) {
    return sum(elves.sort(desc).slice(0, 3));
  },
});
