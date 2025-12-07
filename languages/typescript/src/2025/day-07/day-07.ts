import { Vec2 } from '../../types/math/Vec2.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { TileMap } from '../../utils/datatypes/tilemap.ts';
import { memoize } from '../../utils/memoize.ts';
import { Str } from '../../utils/strs.ts';

enum Tile {
  Empty = '.',
  Splitter = '^',
  Start = 'S',
}

const directions = {
  down: Vec2.new(1, 0),
  left: Vec2.new(0, -1),
  right: Vec2.new(0, 1),
};

export default Puzzle.new({
  prepare: (content): TileMap<Tile> => TileMap.fromGrid(Str.lines(content).map((line) => line.split('') as Tile[])),
  easy(map) {
    const start = map.find(Tile.Start);
    if (!start) return 0;

    const queue: Vec2[] = [start];
    const visited = new Set<number>();
    let count = 0;

    while (queue.length) {
      let position = queue.pop()!;

      while (true) {
        const id = map.id(position);
        if (visited.has(id)) break;
        visited.add(id);

        if (map.is(position, Tile.Splitter)) {
          const left = Vec2.add(position, directions.left);
          if (!visited.has(map.id(left))) {
            queue.push(left);
          }

          const right = Vec2.add(position, directions.right);
          if (!visited.has(map.id(right))) {
            queue.push(right);
          }

          ++count;
          break;
        }

        const next = Vec2.add(position, directions.down);
        if (!map.inBounds(next)) break;

        position = next;
      }
    }

    return count;
  },
  hard(map) {
    const start = map.find(Tile.Start);
    if (!start) return 0;

    const count = memoize((position: Vec2): number => {
      while (true) {
        if (map.is(position, Tile.Splitter)) {
          return count(Vec2.add(position, directions.left)) + count(Vec2.add(position, directions.right));
        }

        const next = Vec2.add(position, directions.down);
        if (!map.inBounds(next)) return 1;

        position = next;
      }
    }, map.id);

    return count(start);
  },
});
