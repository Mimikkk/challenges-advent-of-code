import { Puzzle } from '../../types/puzzle.ts';
import { Str } from '../../utils/strs.ts';

interface Valve {
  rate: number;
  connections: string[];
}
type ValveMap = Map<string, Valve>;

function computeDistances(valves: ValveMap): Map<string, Map<string, number>> {
  const result = new Map<string, Map<string, number>>();

  for (const valve of valves.keys()) {
    const queue: [string, number][] = [[valve, 0]];

    const visited = new Set<string>([valve]);
    const distances = new Map<string, number>();

    while (queue.length) {
      const [node, distance] = queue.shift()!;
      distances.set(node, distance);

      for (const neighbor of valves.get(node)!.connections) {
        if (visited.has(neighbor)) continue;

        visited.add(neighbor);
        queue.push([neighbor, distance + 1]);
      }
    }
    result.set(valve, distances);
  }

  return result;
}

export default Puzzle.new({
  prepare: (content) => {
    const valvesArr = Str.lines(content).map((line) => {
      const [_, name, rate, tunnels] = /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? ([\w,\s]+)/.exec(
        line,
      )!;
      return { name, rate: +rate, connections: tunnels.split(',').map((s) => s.trim()) };
    });
    const result: ValveMap = new Map();
    for (const valve of valvesArr) {
      result.set(valve.name, { rate: valve.rate, connections: valve.connections });
    }
    return result;
  },

  easy: (valves) => {
    const StepLimit = 30;
    const candidates = Array.from(valves.entries()).filter(([_, v]) => v.rate > 0).map(([n]) => n);
    const distanceMap = computeDistances(valves);

    let max = 0;
    const indices = Object.fromEntries(candidates.map((v, i) => [v, i]));

    const traverse = (activeValve: string, activeStep: number, activeSum: number, openBitSet: number) => {
      if (activeSum > max) max = activeSum;

      for (const candidate of candidates) {
        const bit = 1 << indices[candidate];
        if (openBitSet & bit) continue;

        const distanceSteps = distanceMap.get(activeValve)!.get(candidate)!;
        const requiredSteps = distanceSteps + 1;
        const step = activeStep + requiredSteps;
        if (step > StepLimit) continue;

        const releaseValue = valves.get(candidate)!.rate * (StepLimit - step + 1);
        traverse(candidate, step, activeSum + releaseValue, openBitSet | bit);
      }
    };

    traverse('AA', 1, 0, 0);
    return max;
  },

  hard: (valves) => {
    const StepLimit = 26;
    const candidates = Array.from(valves.entries())
      .filter(([_, v]) => v.rate > 0)
      .map(([n]) => n);

    const n = candidates.length;
    const distanceMap = computeDistances(valves);

    const maxResultCache = new Map<number, number>();
    const traverse = (activeValve: string, activeStep: number, activeSum: number, openBitSet: number) => {
      if ((maxResultCache.get(openBitSet) ?? -1) < activeSum) {
        maxResultCache.set(openBitSet, activeSum);
      }

      for (let i = 0; i < n; ++i) {
        const valve = candidates[i];
        const bit = 1 << i;
        if (openBitSet & bit) continue;
        const step = activeStep + distanceMap.get(activeValve)!.get(valve)! + 1;
        if (step > StepLimit) continue;

        const releaseValue = valves.get(valve)!.rate * (StepLimit - step + 1);
        traverse(valve, step, activeSum + releaseValue, openBitSet | bit);
      }
    };

    traverse('AA', 1, 0, 0);

    let result = 0;
    const entries = Array.from(maxResultCache.entries());
    for (const [mask1, value1] of entries) {
      for (const [mask2, value2] of entries) {
        if ((mask1 & mask2) !== 0) continue;

        const total = value1 + value2;
        if (total > result) result = total;
      }
    }

    return result;
  },
});
