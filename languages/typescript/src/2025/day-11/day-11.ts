import { Puzzle } from '../../types/puzzle.ts';
import { sumBy } from '../../utils/maths.ts';
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
    const stack: string[] = ['you'];

    let count = 0;
    while (stack.length) {
      const current = stack.pop()!;

      if (current === 'out') {
        ++count;
        continue;
      }

      const nexts = graph.get(current);
      if (nexts) stack.push(...nexts);
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
      return sumBy(nexts, (next) => countPaths(next, hasDac || next === 'dac', hasFft || next === 'fft'));
    });

    return countPaths('svr', false, false);
  },
});
