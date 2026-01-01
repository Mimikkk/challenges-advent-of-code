import { Puzzle } from '../../types/puzzle.ts';
import { sumBy } from '../../utils/maths.ts';

type Packet = number | Packet[];

const compare = (left: Packet, right: Packet): number => {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0, it = Math.min(left.length, right.length); i < it; ++i) {
      const value = compare(left[i], right[i]);

      if (value !== 0) {
        return value;
      }
    }

    return left.length - right.length;
  }

  if (typeof left === 'number') {
    return compare([left], right);
  }

  return compare(left, [right]);
};

export default Puzzle.new({
  prepare: (content) =>
    content
      .trim()
      .split('\n\n')
      .map((pair) => pair.split('\n').map((line) => JSON.parse(line))),
  easy: (packets) => sumBy(packets, ([left, right], i) => (compare(left, right) < 0 ? i + 1 : 0)),
  hard: (packets) => {
    const firstDivider = [[2]];
    const secondDivider = [[6]];
    const allPackets = [...packets.flat(), firstDivider, secondDivider].sort(compare);

    const firstDividerIndex = allPackets.findIndex((p) => p === firstDivider) + 1;
    const secondDividerIndex = allPackets.findIndex((p) => p === secondDivider) + 1;

    return firstDividerIndex * secondDividerIndex;
  },
});
