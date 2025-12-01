import { Puzzle } from '../../types/puzzle.ts';
import { Str } from '../../utils/strs.ts';

enum Direction {
  Left = 'L',
  Right = 'R',
}

const parse = (line: string): [direction: Direction, distance: number] => {
  const [_, direction, distance] = line.match(/^([LR])(\d+)$/)!;
  return [direction as Direction, +distance];
};

export default Puzzle.new({
  prepare: (lines) => Str.lines(lines).map(parse),
  easy(lines) {
    let count = 0;

    let rotation = 50;
    for (const [direction, distance] of lines) {
      const sign = direction === Direction.Left ? 1 : -1;

      if (rotation % 100 === 0) ++count;

      rotation += sign * distance;
    }

    return count;
  },
  hard(lines) {
    let count = 0;

    let rotation = 50;
    for (const [direction, distance] of lines) {
      const sign = direction === Direction.Left ? 1 : -1;

      count += Math.floor((((sign * rotation) % 100 + 100) % 100 + distance) / 100);

      rotation += sign * distance;
    }

    return count;
  },
});
