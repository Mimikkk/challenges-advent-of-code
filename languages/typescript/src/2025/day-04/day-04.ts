import { Neighbours2 } from '../../types/grids/grids.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { TileMap } from '../../utils/datatypes/tilemap.ts';
import { Str } from '../../utils/strs.ts';

enum Tile {
  Empty = '.',
  Paper = '@',
}

const isAccessible = (map: TileMap<Tile>, x: number, y: number): boolean => {
  let count = 0;

  for (const neighbour of Neighbours2.all) {
    const xdx = x + neighbour.x;
    const ydy = y + neighbour.y;
    if (!map.is(xdx, ydy, Tile.Paper)) continue;
    if (++count > 3) return false;
  }

  return true;
};

export default Puzzle.new({
  prepare: (content) => TileMap.fromGrid<Tile>(Str.lines(content).map((line) => line.split('') as Tile[])),
  easy(map) {
    return map.count((tile, x, y) => tile === Tile.Paper && isAccessible(map, x, y));
  },
  hard(map) {
    const beforeCount = map.count(Tile.Paper);

    for (let hadChange = true; hadChange;) {
      const accessible = map.filter(Tile.Paper).filter(({ x, y }) => isAccessible(map, x, y));

      for (const { x, y } of accessible) {
        map.set(x, y, Tile.Empty);
      }

      hadChange = accessible.length > 0;
    }

    return beforeCount - map.count(Tile.Paper);
  },
});
