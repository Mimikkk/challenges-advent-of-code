import { Ids } from '../../types/math/Ids.ts';
import { Vec2 } from '../../types/math/Vec2.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { TileMap } from '../../utils/datatypes/tilemap.ts';
import { sum } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

const neighbours = [
  // up-left, up, up-right, left, right, down-left, down, down-right
  Vec2.new(-1, -1),
  Vec2.new(-1, 0),
  Vec2.new(-1, 1),
  Vec2.new(0, -1),
  Vec2.new(0, 1),
  Vec2.new(1, -1),
  Vec2.new(1, 0),
  Vec2.new(1, 1),
];

const isDigitChar = (char: string | undefined): char is string => char !== undefined && char >= '0' && '9' >= char;

const readPartValue = (tilemap: TileMap<string>, visited: Set<number>, startAtX: number, startAtY: number): number => {
  const center = tilemap.at(startAtX, startAtY);

  const lefts = [];
  for (let y = startAtY - 1; y >= 0; --y) {
    visited.add(Ids.xyi32(startAtX, y));

    const value = tilemap.at(startAtX, y);
    if (isDigitChar(value)) {
      lefts.push(value);
    } else {
      break;
    }
  }

  const rights = [];
  for (let y = startAtY + 1; y < tilemap.m; ++y) {
    visited.add(Ids.xyi32(startAtX, y));

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

    const partValue = [];
    for (let x = 0; x < tilemap.n; ++x) {
      for (let y = 0; y < tilemap.m; ++y) {
        const value = tilemap.at(x, y);
        if (value === '.' || isDigitChar(value)) continue;

        for (const { x: dx, y: dy } of neighbours) {
          const ox = x + dx;
          const oy = y + dy;
          if (!tilemap.inBounds(ox, oy)) continue;

          const ov = tilemap.at(ox, oy);
          if (!isDigitChar(ov)) continue;

          const id = Ids.xyi32(ox, oy);
          if (visits.has(id)) continue;
          visits.add(id);

          partValue.push(readPartValue(tilemap, visits, ox, oy));
        }
      }
    }

    return sum(partValue);
  },
  hard(grid) {
    const tilemap = TileMap.fromGrid(grid);
    const visits = new Set<number>();

    const gearValue = [];
    for (let x = 0; x < tilemap.n; ++x) {
      for (let y = 0; y < tilemap.m; ++y) {
        if (!tilemap.is(x, y, '*')) continue;

        const partValues = [];
        for (const { x: dx, y: dy } of neighbours) {
          const ox = x + dx;
          const oy = y + dy;
          if (!tilemap.inBounds(ox, oy)) continue;

          const ov = tilemap.at(ox, oy);
          if (!isDigitChar(ov)) continue;

          const id = Ids.xyi32(ox, oy);
          if (visits.has(id)) continue;
          visits.add(id);

          partValues.push(readPartValue(tilemap, visits, ox, oy));
        }

        if (partValues.length !== 2) continue;
        gearValue.push(partValues[0] * partValues[1]);
      }
    }

    return sum(gearValue);
  },
});
