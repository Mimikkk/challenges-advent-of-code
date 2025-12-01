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
  easy: (lines) => {
    let count = 0;

    let value = 50;
    for (const [direction, distance] of lines) {
      value = (value - (+distance * (direction === Direction.Left ? -1 : 1)) + 100) % 100;

      if (value === 0) ++count;
    }

    return count;
  },
  hard: (lines) => {
    let count = 0;

    let start = 50;
    for (const [direction, distance] of lines) {
      const dir = direction === Direction.Left ? -1 : 1;

      for (let i = 0; i < +distance; ++i) {
        start = (start + dir + 100) % 100;

        if (start === 0) ++count;
      }
    }

    return count;
  },
});
