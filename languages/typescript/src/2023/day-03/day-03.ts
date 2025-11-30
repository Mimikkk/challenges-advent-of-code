import { Neighbours } from '../../types/grids/grids.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { TileMap } from '../../utils/datatypes/tilemap.ts';
import { sum } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

const neighbours = Neighbours.all;

const isDigitChar = (char: string | undefined): char is string => char !== undefined && char >= '0' && '9' >= char;

const readPartValue = (tilemap: TileMap<string>, visited: Set<number>, startAtX: number, startAtY: number): number => {
  const center = tilemap.at(startAtX, startAtY);

  const lefts = [];
  for (let y = startAtY - 1; y >= 0; --y) {
    visited.add(tilemap.id(startAtX, y));

    const value = tilemap.at(startAtX, y);
    if (isDigitChar(value)) {
      lefts.push(value);
    } else {
      break;
    }
  }

  const rights = [];
  for (let y = startAtY + 1; y < tilemap.m; ++y) {
    visited.add(tilemap.id(startAtX, y));

    const value = tilemap.at(startAtX, y);
    if (isDigitChar(value)) {
      rights.push(value);
    } else {
      break;
    }
  }

  return +[...lefts.reverse(), center, ...rights].join('');
};

export default Puzzle.new({
  prepare: Str.grid,
  easy(grid) {
    const tilemap = TileMap.fromGrid(grid);
    const visits = new Set<number>();

    const partValues = [];
    const positions = tilemap.filter((value) => value !== '.' && !isDigitChar(value));
    for (const { x, y } of positions) {
      for (const { x: dx, y: dy } of neighbours) {
        const ox = x + dx;
        const oy = y + dy;
        if (!tilemap.is(ox, oy, isDigitChar)) continue;

        const id = tilemap.id(ox, oy);
        if (visits.has(id)) continue;
        visits.add(id);

        partValues.push(readPartValue(tilemap, visits, ox, oy));
      }
    }

    return sum(partValues);
  },
  hard(grid) {
    const tilemap = TileMap.fromGrid(grid);
    const visits = new Set<number>();

    const positions = tilemap.filter('*');

    const gearValues = [];
    positions_iterator: for (const { x, y } of positions) {
      let first: undefined | number;
      let second: undefined | number;
      for (const { x: dx, y: dy } of neighbours) {
        const ox = x + dx;
        const oy = y + dy;
        if (!tilemap.is(ox, oy, isDigitChar)) continue;

        const id = tilemap.id(ox, oy);
        if (visits.has(id)) continue;
        visits.add(id);

        const value = readPartValue(tilemap, visits, ox, oy);
        if (first === undefined) {
          first = value;
        } else if (second === undefined) {
          second = value;
        } else {
          continue positions_iterator;
        }
      }

      if (first === undefined || second === undefined) continue;
      gearValues.push(first * second);
    }

    return sum(gearValues);
  },
});
