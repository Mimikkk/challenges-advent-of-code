import { Ids } from '../../types/math/Ids.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { Str } from '../../utils/strs.ts';

export default Puzzle.new({
  prepare(content) {
    const border = new Set<number>();

    let maxY = 0;
    for (const line of Str.lines(content)) {
      const points = line.split(' -> ').map((pointsStr) => {
        const [x, y] = pointsStr.split(',').map(Number);
        if (y > maxY) maxY = y;
        return [x, y];
      });

      for (let i = 1; i < points.length; ++i) {
        const [x1, y1] = points[i - 1], [x2, y2] = points[i];
        const dx = Math.sign(x2 - x1);
        const dy = Math.sign(y2 - y1);

        let x = x1, y = y1;
        while (x !== x2 || y !== y2) {
          border.add(Ids.xyi32(x, y));
          if (x !== x2) x += dx;
          if (y !== y2) y += dy;
        }

        border.add(Ids.xyi32(x2, y2));
      }
    }

    return { border, maxY };
  },
  easy({ border, maxY }) {
    let result = 0;

    sand: while (true) {
      let x = 500;
      let y = 0;

      while (true) {
        if (y > maxY) break sand;

        if (!border.has(Ids.xyi32(x, y + 1))) {
          y++;
        } else if (!border.has(Ids.xyi32(x - 1, y + 1))) {
          x--;
          y++;
        } else if (!border.has(Ids.xyi32(x + 1, y + 1))) {
          x++;
          y++;
        } else {
          border.add(Ids.xyi32(x, y));
          ++result;
          break;
        }
      }
    }

    return result;
  },
  hard({ border, maxY }) {
    const floorY = maxY + 1;

    let result = 0;
    const expected = Ids.xyi32(500, 0);
    while (!border.has(expected)) {
      let x = 500;
      let y = 0;

      while (true) {
        if (y === floorY) {
          border.add(Ids.xyi32(x, y));
          ++result;
          break;
        }

        if (!border.has(Ids.xyi32(x, y + 1))) {
          y++;
        } else if (!border.has(Ids.xyi32(x - 1, y + 1))) {
          x--;
          y++;
        } else if (!border.has(Ids.xyi32(x + 1, y + 1))) {
          x++;
          y++;
        } else {
          border.add(Ids.xyi32(x, y));
          ++result;
          break;
        }
      }
    }
    return result;
  },
});
