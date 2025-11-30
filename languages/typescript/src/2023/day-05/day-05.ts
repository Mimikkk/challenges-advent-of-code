import { Puzzle } from '../../types/puzzle.ts';
import { minBy } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

type SeedMap = [destination: number, source: number, size: number];
type Range = [start: number, size: number];

const applyMap = (value: number, map: SeedMap[]): number => {
  for (const [destination, source, range] of map) {
    if (value < source || value >= source + range) continue;
    return destination + (value - source);
  }

  return value;
};

const applyMaps = (value: number, maps: SeedMap[][]): number => {
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

    const maps: SeedMap[][] = Array(7);
    for (let i = 0; i < 7; ++i) maps[i] = [];

    for (let i = 2, j = 0, it = mapsStrs.length; i < it; i += 2, ++j) {
      while (mapsStrs[i] !== '' && i < it) {
        maps[j].push(mapsStrs[i++].split(' ').map((s) => +s) as SeedMap);
      }
    }

    return { seeds, maps };
  },
  easy({ seeds, maps }) {
    return minBy(seeds, (value) => applyMaps(value, maps));
  },
  hard({ seeds, maps }) {
    let ranges: Range[] = Array(seeds.length / 2);
    for (let i = 0; i < seeds.length; i += 2) {
      ranges[i / 2] = [seeds[i], seeds[i + 1]];
    }

    for (const map of maps) {
      const next: Range[] = [];

      ranges_iterator: for (const [start, size] of ranges) {
        for (const [destination, source, range] of map) {
          if (!(start < source + range && source < start + size)) continue;
          const max = Math.max(start, source);
          const min = Math.min(start + size, source + range) - max;

          next.push([max - source + destination, min]);
          if (max > start || max + min < start + size) {
            ranges.push([start, max - start], [max + min, start + size - max - min]);
          }

          continue ranges_iterator;
        }

        next.push([start, size]);
      }

      ranges = next;
    }

    return Math.min(...ranges.map(([s]) => s));
  },
});
