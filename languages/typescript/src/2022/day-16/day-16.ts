import { Puzzle } from '../../types/puzzle.ts';
import { Str } from '../../utils/strs.ts';

// clanker:opt
// You are given a network of valves connected by tunnels.
// Each valve X has a flow rate (possibly zero), is initially closed, and a list of adjacent valves.
// Starting at AA, you have 30 minutes.
// Each minute, you can move to an adjacent valve or open the current valve (if closed).
// Opening a valve adds its flow rate to the total pressure released every subsequent minute.
// Goal: Find the path of movements and valve openings that maximizes total released pressure in 30 minutes.
// Input: Each line describes valve name, flow rate, and its connected valves.
//
// Example input:
// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
// Valve BB has flow rate=13; tunnels lead to valves CC, AA
// Valve CC has flow rate=2; tunnels lead to valves DD, BB
// Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
// Valve EE has flow rate=3; tunnels lead to valves FF, DD
// Valve FF has flow rate=0; tunnels lead to valves EE, GG
// Valve GG has flow rate=0; tunnels lead to valves FF, HH
// Valve HH has flow rate=22; tunnel leads to valve GG
// Valve II has flow rate=0; tunnels lead to valves AA, JJ
// Valve JJ has flow rate=21; tunnel leads to valve II

const TimeSteps = 30;

interface Valve {
  rate: number;
  connections: Valve[];
}

export default Puzzle.new({
  prepare: (content) => {
    const valves = Str.lines(content).map((line) => {
      const [_, name, rate, tunnels] = /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? ([\w,]+)/.exec(
        line,
      )!;
      return { name, rate: +rate, connections: tunnels.split(',').filter(Boolean) };
    });

    const result = new Map<string, Valve>();
    for (const valve of valves) {
      result.set(valve.name, { rate: valve.rate, connections: [] });
    }

    for (const valve of valves) {
      result.get(valve.name)?.connections.push(...valve.connections.map((connection) => result.get(connection)!));
    }

    return result;
  },
  easy: (valves) => {
    console.log(valves);

    return 0;
  },
});
