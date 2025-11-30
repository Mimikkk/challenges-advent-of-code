import { Puzzle } from '../../types/puzzle.ts';
import { minBy } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

type SeedMapRange = [destinationStart: number, sourceStart: number, rangeLength: number];
type SeedRange = [start: number, length: number];

const applyMap = (value: number, map: SeedMapRange[]): number => {
  for (const [destinationStart, sourceStart, rangeLength] of map) {
    const sourceEnd = sourceStart + rangeLength;

    if (value < sourceStart || value >= sourceEnd) continue;
    return destinationStart + value - sourceStart;
  }

  return value;
};

const applyMaps = (value: number, maps: SeedMapRange[][]): number => {
  for (const map of maps) {
    value = applyMap(value, map);
  }

  return value;
};

export default Puzzle.new({
  prepare(input) {
    const [seedsStr, ...mapsStrs] = Str.lines(input);

    const seeds = seedsStr
      .split(' ')
      .map((s) => +s)
      .slice(1);

    const maps: SeedMapRange[][] = Array(7);
    for (let i = 0; i < 7; ++i) maps[i] = [];

    for (let i = 2, j = 0, it = mapsStrs.length; i < it; i += 2, ++j) {
      while (mapsStrs[i] !== '' && i < it) {
        maps[j].push(mapsStrs[i++].split(' ').map((s) => +s) as SeedMapRange);
      }
    }

    return { seeds, maps };
  },
  easy({ seeds, maps }) {
    return minBy(seeds, (value) => applyMaps(value, maps));
  },
  hard({ seeds, maps }) {
    let values: SeedRange[] = Array(seeds.length / 2);
    for (let i = 0; i < seeds.length; i += 2) {
      values[i / 2] = [seeds[i], seeds[i + 1]];
    }

    for (const map of maps) {
      values = ((ranges: SeedRange[]) => {
        const result: SeedRange[] = [];

        while (ranges.length > 0) {
          const range = ranges.pop()!;

          const transform = (range: SeedRange): SeedRange => {
            const [valueStart, valueLength] = range;
            const valueEnd = valueStart + valueLength;

            for (const [destinationStart, sourceStart, size] of map) {
              const sourceEnd = sourceStart + size;
              if (valueStart >= sourceEnd || sourceStart >= valueEnd) continue;

              const overlapStart = Math.max(valueStart, sourceStart);
              const overlapEnd = Math.min(valueEnd, sourceEnd);
              const overlapLength = overlapEnd - overlapStart;

              // check left side for extra overlap
              if (overlapStart > valueStart) {
                ranges.push([valueStart, overlapStart - valueStart]);
              }

              // check right side for extra overlap
              if (overlapEnd < valueEnd) {
                ranges.push([overlapEnd, valueEnd - overlapEnd]);
              }

              const transformedStart = destinationStart + overlapStart - sourceStart;
              return [transformedStart, overlapLength];
            }

            return range;
          };

          result.push(transform(range));
        }

        return result;
      })(values);
    }

    return Math.min(...values.map(([start]) => start));
  },
});
