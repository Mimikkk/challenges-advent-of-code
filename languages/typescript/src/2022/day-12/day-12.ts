import { Neighbours } from '../../types/grids/grids.ts';
import { Ids } from '../../types/math/Ids.ts';
import type { Vec2 } from '../../types/math/Vec2.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { TileMap } from '../../utils/datatypes/tilemap.ts';
import { Str } from '../../utils/strs.ts';

interface Input {
  heights: TileMap<number>;
  start: Vec2;
  starts: Vec2[];
  destination: Vec2;
}

const parseInput = (content: string): Input => {
  const terrain = TileMap.fromGrid(Str.grid(content));

  const starts = terrain.filter((tile) => tile === 'a' || tile === 'S');
  const start = terrain.find('S')!;
  const destination = terrain.find('E')!;
  const heights = terrain.map((tile) => tile === 'S' ? 0 : tile === 'E' ? 26 : tile.charCodeAt(0) - 97);

  return { start, starts, destination, heights };
};

const neighbours = Neighbours.orthogonals;
const findShortestPathLength = ({ start, destination, heights }: Input): number => {
  const stack: [x: number, y: number, length: number][] = [[start.x, start.y, 0]];

  const visited = new Set<number>();

  let shortest = Infinity;
  while (stack.length) {
    const [x, y, length] = stack.shift()!;
    const heightFrom = heights.at(x, y);

    if (x === destination.x && y === destination.y) {
      if (length < shortest) {
        shortest = length;
      }
    }

    for (let i = 0; i < neighbours.length; ++i) {
      const { x: dx, y: dy } = neighbours[i];

      const xdx = x + dx;
      const ydy = y + dy;

      const id = Ids.n3i32(xdx, ydy, i);
      if (visited.has(id)) continue;
      visited.add(id);

      if (!heights.inBounds(xdx, ydy)) continue;

      const heightTo = heights.at(xdx, ydy);
      if (heightTo === undefined || heightTo - heightFrom! > 1) continue;

      stack.push([xdx, ydy, length + 1]);
    }
  }

  return shortest;
};
const findShortestPathLengthMultipleStarts = ({ starts, destination, heights }: Input): number => {
  const stack: [x: number, y: number, length: number][] = starts.map(({ x, y }) => [x, y, 0]);

  const visited = new Set<number>();

  let shortest = Infinity;
  while (stack.length) {
    const [x, y, length] = stack.shift()!;
    const heightFrom = heights.at(x, y);

    if (x === destination.x && y === destination.y) {
      if (length < shortest) {
        shortest = length;
      }
    }

    for (let i = 0; i < neighbours.length; ++i) {
      const { x: dx, y: dy } = neighbours[i];

      const xdx = x + dx;
      const ydy = y + dy;

      const id = Ids.n3i32(xdx, ydy, i);
      if (visited.has(id)) continue;
      visited.add(id);

      if (!heights.inBounds(xdx, ydy)) continue;

      const heightTo = heights.at(xdx, ydy);
      if (heightTo === undefined || heightTo - heightFrom! > 1) continue;

      stack.push([xdx, ydy, length + 1]);
    }
  }

  return shortest;
};

export default Puzzle.new({
  prepare: parseInput,
  easy: findShortestPathLength,
  hard: findShortestPathLengthMultipleStarts,
});
