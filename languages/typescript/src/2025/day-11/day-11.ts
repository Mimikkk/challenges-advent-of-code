import { Puzzle } from '../../types/puzzle.ts';
import { memoize } from '../../utils/memoize.ts';
import { Str } from '../../utils/strs.ts';

export default Puzzle.new({
  prepare: (input: string) => {
    const lines = Str.lines(input);
    const graph = new Map<string, string[]>();
    for (const line of lines) {
      if (!line.trim()) continue;
      const [from, toStr] = line.split(':');
      graph.set(from.trim(), toStr.trim().split(/\s+/));
    }
    return graph;
  },
  easy(graph) {
    const stack: [string, string[]][] = [['you', []]];

    let count = 0;
    while (stack.length) {
      const [current, path] = stack.pop()!;

      if (current === 'out') {
        ++count;
        continue;
      }

      const nexts = graph.get(current);
      if (!nexts) continue;

      for (const next of nexts) {
        stack.push([next, [...path, next]]);
      }
    }

    return count;
  },
  hard(graph) {
    const countPaths = memoize((current: string, hasDac: boolean, hasFft: boolean): number => {
      if (current === 'out') {
        return (hasDac && hasFft) ? 1 : 0;
      }

      const nexts = graph.get(current);
      if (!nexts) return 0;

      let result = 0;

      for (let i = 0; i < nexts.length; ++i) {
        const next = nexts[i];
        result += countPaths(next, hasDac || next === 'dac', hasFft || next === 'fft');
      }

      return result;
    });

    return countPaths('svr', false, false);
  },
});
