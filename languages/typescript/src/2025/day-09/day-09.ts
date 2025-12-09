import { Vec2 } from '../../types/math/Vec2.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { Str } from '../../utils/strs.ts';

const calcArea = (a: Vec2, b: Vec2) => (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1);
export default Puzzle.new({
  prepare: (content) => {
    return Str.lines(content).map((line) => Vec2.fromArray(line.split(',').map((value) => +value)));
  },
  easy(corners) {
    const n = corners.length;

    let result = 0;
    for (let i = 0; i < n; ++i) {
      for (let j = i + 1; j < n; ++j) {
        const area = calcArea(corners[i], corners[j]);

        if (area > result) result = area;
      }
    }

    return result;
  },
  hard(corners) {
    const candidates: { area: number; a: Vec2; b: Vec2 }[] = [];
    for (let i = 0; i < corners.length; ++i) {
      for (let j = i + 1; j < corners.length; ++j) {
        const area = calcArea(corners[i], corners[j]);

        candidates.push({ area, a: corners[i], b: corners[j] });
      }
    }
    candidates.sort((a, b) => b.area - a.area);

    const edges = corners.map((from, i) => ({ from, to: corners[i + 1 === corners.length ? 0 : i + 1] }));

    const inRange = (a1: number, a2: number, b1: number, b2: number) =>
      !(a1 <= b1 && a2 <= b1 && a1 <= b2 && a2 <= b2) && !(a1 >= b1 && a2 >= b1 && a1 >= b2 && a2 >= b2);

    const intersectsEdges = ({ a, b }: { a: Vec2; b: Vec2 }): boolean =>
      edges.some(({ from, to }) => inRange(from.y, to.y, a.y, b.y) && inRange(from.x, to.x, a.x, b.x));

    return candidates.find((candidate) => !intersectsEdges(candidate))?.area ?? 0;
  },
});
