import { Vec3 } from '../../types/math/Vec3.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { Counter } from '../../utils/datatypes/counter.ts';
import { product } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

type Edge = { from: number; to: number; distance: number };
type UnionNode = { root: number; size: number };

const solution = (positions: Vec3[], steps: number): number => {
  const n = positions.length;
  const edges: Edge[] = [];

  for (let i = 0; i < n; ++i) {
    for (let j = i + 1; j < n; ++j) {
      edges.push({ from: i, to: j, distance: Vec3.euclideanSquared(positions[i], positions[j]) });
    }
  }

  edges.sort((a, b) => a.distance - b.distance);

  const nodes: UnionNode[] = Array.from({ length: n }, (_, i) => ({ root: i, size: 1 }));

  const findRoot = (nodeId: number): number => {
    if (nodes[nodeId].root !== nodeId) {
      nodes[nodeId].root = findRoot(nodes[nodeId].root);
    }
    return nodes[nodeId].root;
  };

  const joinClosestClusters = (a: number, b: number): boolean => {
    const rootA = findRoot(a);
    const rootB = findRoot(b);

    if (rootA === rootB) {
      return false;
    }

    if (nodes[rootA].size < nodes[rootB].size) {
      nodes[rootA].root = rootB;
      nodes[rootB].size += nodes[rootA].size;
    } else {
      nodes[rootB].root = rootA;
      nodes[rootA].size += nodes[rootB].size;
    }

    return true;
  };

  for (let i = 0, it = Math.min(steps, edges.length); i < it; ++i) {
    const { from, to } = edges[i];
    joinClosestClusters(from, to);

    if (nodes[findRoot(0)].size !== n) continue;
    return product([positions[from].x, positions[to].x]);
  }

  const counter = Counter.fromArray(Array.from({ length: n }, (_, i) => findRoot(i)));
  const sizes = Array.from(counter.values()).sort((a, b) => a - b);

  return product(sizes.slice(-3));
};

export default Puzzle.new({
  prepare: (content) => Str.lines(content).map((line) => Vec3.fromArray(line.split(',').map(Number))),
  easy(nodes) {
    return solution(nodes, 1000);
  },
  hard(nodes) {
    return solution(nodes, Math.floor(nodes.length * (nodes.length - 1) / 2));
  },
});
