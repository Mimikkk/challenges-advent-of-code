import { Ids } from '../../types/math/Ids.ts';
import { Vec2 } from '../../types/math/Vec2.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { maxBy } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

export default Puzzle.new({
  prepare: (content) =>
    Str.lines(content).map((line) =>
      /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
        .exec(line)!
        .slice(1)
        .map(Number)
    ).map(([sx, sy, bx, by]) => {
      const sensor = Vec2.new(sx, sy);
      const beacon = Vec2.new(bx, by);
      const distance = sensor.manhattan(beacon);

      return ({ sensor, beacon, distance });
    }),
  easy: (context) => {
    const vec = Vec2.new();
    const minX = Math.min(...context.map(({ sensor }) => sensor.x), ...context.map(({ beacon }) => beacon.x));
    const maxX = Math.max(...context.map(({ sensor }) => sensor.x), ...context.map(({ beacon }) => beacon.x));
    const boundry = minX === -2 ? 10 : 2000000;

    let count = 0;

    const maxDistance = maxBy(context, ({ distance }) => distance);
    const startX = minX - maxDistance;
    const endX = maxX + maxDistance;

    const knownBeacons = context.map(({ beacon }) => beacon);
    for (let x = startX; x <= endX; ++x) {
      vec.set(x, boundry);
      if (knownBeacons.some((beacon) => vec.equals(beacon))) continue;

      for (const { sensor, distance } of context) {
        if (vec.manhattan(sensor) > distance) continue;
        ++count;
        break;
      }
    }

    return count;
  },
  hard: (context) => {
    const boundarySize = context.some(({ sensor }) => sensor.x < 100) ? 20 : 4000000;

    const knownBeacons = new Set(context.map(({ beacon }) => Ids.v2i32(beacon)));
    const calcFrequency = (x: number, y: number) => x * 4000000 + y;

    for (let y = 0; y <= boundarySize; ++y) {
      const intervals: [number, number][] = [];
      for (const { sensor, distance } of context) {
        const dy = Math.abs(sensor.y - y);
        if (dy > distance) continue;

        const rem = distance - dy;
        let start = sensor.x - rem;
        let end = sensor.x + rem;
        if (end < 0 || start > boundarySize) continue;

        start = Math.max(0, start);
        end = Math.min(boundarySize, end);
        intervals.push([start, end]);
      }
      intervals.sort(([a], [b]) => a - b);

      let prevEnd = -1;
      for (const [start, end] of intervals) {
        if (start <= prevEnd + 1) {
          prevEnd = Math.max(prevEnd, end);
          continue;
        }

        for (let x = prevEnd + 1; x < start; ++x) {
          if (knownBeacons.has(Ids.n2i32(x, y))) continue;
          return calcFrequency(x, y);
        }

        prevEnd = Math.max(prevEnd, end);
      }

      if (prevEnd >= boundarySize) continue;
      for (let x = prevEnd + 1; x <= boundarySize; ++x) {
        if (knownBeacons.has(Ids.n2i32(x, y))) continue;
        return calcFrequency(x, y);
      }
    }
  },
});
