import { Ids } from '../../types/math/Ids.ts';
import { Vec2 } from '../../types/math/Vec2.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { TileMap } from '../../utils/datatypes/tilemap.ts';
import { Str } from '../../utils/strs.ts';

/*
The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.

You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.

Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.

The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.

This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.

Consider the same engine schematic again:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.

What is the sum of all of the gear ratios in your engine schematic?

Your puzzle answer was 72246648.
*/

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

export default Puzzle.new({
  prepare: Str.grid,
  easy: (grid) => {
    const tilemap = TileMap.fromGrid(grid);

    const visited = new Set<number>();
    const visit = (x: number, y: number) => {
      visited.add(Ids.xyi32(x, y));
    };

    const readPartValue = (tilemap: TileMap<string>, startAtX: number, startAtY: number): number => {
      const center = tilemap.at(startAtX, startAtY);

      const lefts = [];
      for (let y = startAtY - 1; y >= 0; --y) {
        visit(startAtX, y);

        const value = tilemap.at(startAtX, y);
        if (isDigitChar(value)) {
          lefts.push(value);
        } else {
          break;
        }
      }

      const rights = [];
      for (let y = startAtY + 1; y < tilemap.m; ++y) {
        visit(startAtX, y);

        const value = tilemap.at(startAtX, y);
        if (isDigitChar(value)) {
          rights.push(value);
        } else {
          break;
        }
      }

      return +[...lefts.reverse(), center, ...rights].join('');
    };

    const candidates = [];
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
          candidates.push(Ids.xyi32(ox, oy));
        }
      }
    }

    let sum = 0;
    for (const id of candidates) {
      if (visited.has(id)) continue;
      visited.add(id);

      sum += readPartValue(tilemap, Ids.i32x(id), Ids.i32y(id));
    }

    return sum;
  },
  hard: () => 0,
});
