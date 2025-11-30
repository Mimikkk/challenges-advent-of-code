import { Puzzle } from '../../types/puzzle.ts';

type Range = { offset: number; start: number; size: number };

const mapRange = (source: number, range: Range): number => {
  if (source >= range.start && source < range.start + range.size) {
    return range.offset + (source - range.start);
  }
  return source;
};

const mapRanges = (
  source: number,
  ranges: Range[],
): number => {
  for (const range of ranges) {
    if (source >= range.start && source < range.start + range.size) {
      return range.offset + (source - range.start);
    }
  }

  return source;
};

type Category = 'seed' | 'soil' | 'fertilizer' | 'water' | 'light' | 'temperature' | 'humidity' | 'location';
const order: Category[] = ['soil', 'fertilizer', 'water', 'light', 'temperature', 'humidity', 'location'];
const parseMaps = (input: string) => {
  const [[seedsStr], ...mapsStrs] = input.split('\n\n').map((s) => s.trim().split('\n'));

  const matchDirections = (str: string) => str.match(/(\w+)-to-(\w+)/)!.slice(1);
  const extractNumbers = (str: string) => str.matchAll(/\d+/g).map((match) => +match[0]).toArray();
  const seeds = extractNumbers(seedsStr);

  const maps = new Map<Category, (source: number) => number>(mapsStrs.map(([name, ...records]) => {
    const [_, to] = matchDirections(name);

    const ranges = records.map(extractNumbers).map(([offset, start, size]) => ({ offset, start, size }));

    return [
      to,
      (source) => mapRanges(source, ranges),
    ] as [Category, (source: number) => number];
  }));

  return { seeds, maps };
};

export default Puzzle.new({
  prepare: (input) => parseMaps(input),
  easy: ({ seeds, maps }) => {
    let min = Infinity;

    for (let seed of seeds) {
      for (const category of order) {
        seed = maps.get(category)!(seed);
      }

      if (seed < min) {
        min = seed;
      }
    }

    return min;
  },
  hard: () => 0,
});
