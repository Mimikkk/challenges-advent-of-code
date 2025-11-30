import { Puzzle } from '../../types/puzzle.ts';
import { minBy } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

type SeedTransform = [destinationStart: number, sourceStart: number, rangeLength: number];
type SeedRange = [start: number, length: number];

const applyMap = (value: number, map: SeedTransform[]): number => {
  for (const [destinationStart, sourceStart, rangeLength] of map) {
    const sourceEnd = sourceStart + rangeLength;

    if (value < sourceStart || value >= sourceEnd) continue;
    return destinationStart + value - sourceStart;
  }

  return value;
};

const applyMaps = (value: number, maps: SeedTransform[][]): number => {
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

    const maps: SeedTransform[][] = Array(7);
    for (let i = 0; i < 7; ++i) maps[i] = [];

    for (let i = 2, j = 0, it = mapsStrs.length; i < it; i += 2, ++j) {
      while (mapsStrs[i] !== '' && i < it) {
        maps[j].push(mapsStrs[i++].split(' ').map((s) => +s) as SeedTransform);
      }
    }

    return { seeds, maps };
  },
  easy({ seeds, maps }) {
    return minBy(seeds, (value) => applyMaps(value, maps));
  },
  hard({ seeds, maps }) {
    let ranges: SeedRange[] = Array(seeds.length / 2);
    for (let i = 0; i < seeds.length; i += 2) {
      ranges[i / 2] = [seeds[i], seeds[i + 1]];
    }

    const applyTransform = (ranges: SeedRange[], range: SeedRange, transforms: SeedTransform[]): SeedRange => {
      const [rangeStart, rangeLength] = range;
      const rangeEnd = rangeStart + rangeLength;

      for (const [destStart, sourceStart, sourceLength] of transforms) {
        const sourceEnd = sourceStart + sourceLength;
        if (rangeStart >= sourceEnd || sourceStart >= rangeEnd) continue;

        const overlapStart = Math.max(rangeStart, sourceStart);
        const overlapEnd = Math.min(rangeEnd, sourceEnd);
        const overlapLength = overlapEnd - overlapStart;

        if (overlapStart > rangeStart) {
          ranges.push([rangeStart, overlapStart - rangeStart]);
        }

        if (overlapEnd < rangeEnd) {
          ranges.push([overlapEnd, rangeEnd - overlapEnd]);
        }

        return [destStart + (overlapStart - sourceStart), overlapLength];
      }

      return range;
    };

    const applyTransforms = (ranges: SeedRange[], transforms: SeedTransform[]): SeedRange[] => {
      const result: SeedRange[] = [];

      for (const range of ranges) {
        result.push(applyTransform(ranges, range, transforms));
      }

      return result;
    };

    for (const map of maps) {
      ranges = applyTransforms(ranges, map);
    }

    return Math.min(...ranges.map(([start]) => start));
  },
});
