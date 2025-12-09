import { Neighbours } from '../../types/grids/grids.ts';
import { Vec2 } from '../../types/math/Vec2.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { Str } from '../../utils/strs.ts';

/*
--- Day 9: Movie Theater ---


Elves here are redecorating the theater by switching out some of the square tiles in the big grid they form.
Some of the tiles are red; the Elves would like to find the largest rectangle that uses red tiles for two of its opposite corners.
They even have a list of where the red tiles are located in the grid (your puzzle input).

For example:

7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3

Showing red tiles as # and other tiles as ., the above arrangement of red tiles would look like this:

..............
.......#...#..
..............
..#....#......
..............
..#......#....
..............
.........#.#..
..............

You can choose any two red tiles as the opposite corners of your rectangle; your goal is to find the largest rectangle possible.

For example, you could make a rectangle (shown as O) with an area of 24 between 2,5 and 9,7:

..............
.......#...#..
..............
..#....#......
..............
..OOOOOOOO....
..OOOOOOOO....
..OOOOOOOO.#..
..............

Or, you could make a rectangle with area 35 between 7,1 and 11,7:

..............
.......OOOOO..
.......OOOOO..
..#....OOOOO..
.......OOOOO..
..#....OOOOO..
.......OOOOO..
.......OOOOO..
..............

You could even make a thin rectangle with an area of only 6 between 7,3 and 2,3:

..............
.......#...#..
..............
..OOOOOO......
..............
..#......#....
..............
.........#.#..
..............

Ultimately, the largest rectangle you can make in this example has area 50. One way to do this is between 2,5 and 11,1:

..............
..OOOOOOOOOO..
..OOOOOOOOOO..
..OOOOOOOOOO..
..OOOOOOOOOO..
..OOOOOOOOOO..
..............
.........#.#..
..............

Using two red tiles as opposite corners, what is the largest area of any rectangle you can make?

--- Part Two ---

The Elves just remembered: they can only switch out tiles that are red or green. So, your rectangle can only include red or green tiles.

In your list, every red tile is connected to the red tile before and after it by a straight line of green tiles.
The list wraps, so the first red tile is also connected to the last red tile.
Tiles that are adjacent in your list will always be on either the same row or the same column.

Using the same example as before, the tiles marked X would be green:

..............
.......#XXX#..
.......X...X..
..#XXXX#...X..
..X........X..
..#XXXXXX#.X..
.........X.X..
.........#X#..
..............

In addition, all of the tiles inside this loop of red and green tiles are also green. So, in this example, these are the green tiles:

..............
.......#XXX#..
.......XXXXX..
..#XXXX#XXXX..
..XXXXXXXXXX..
..#XXXXXX#XX..
.........XXX..
.........#X#..
..............

The remaining tiles are never red nor green.

The rectangle you choose still must have red tiles in opposite corners, but any other tiles it includes must now be red or green. This significantly limits your options.

For example, you could make a rectangle out of red and green tiles with an area of 15 between 7,3 and 11,1:

..............
.......OOOOO..
.......OOOOO..
..#XXXXOOOOO..
..XXXXXXXXXX..
..#XXXXXX#XX..
.........XXX..
.........#X#..
..............

Or, you could make a thin rectangle with an area of 3 between 9,7 and 9,5:

..............
.......#XXX#..
.......XXXXX..
..#XXXX#XXXX..
..XXXXXXXXXX..
..#XXXXXXOXX..
.........OXX..
.........OX#..
..............

The largest rectangle you can make in this example using only red and green tiles has area 24. One way to do this is between 9,5 and 2,3:

..............
.......#XXX#..
.......XXXXX..
..OOOOOOOOXX..
..OOOOOOOOXX..
..OOOOOOOOXX..
.........XXX..
.........#X#..
..............

Using two red tiles as opposite corners, what is the largest area of any rectangle you can make using only red and green tiles?

*/

const isInsidePolygon = ([x, y]: [number, number], polygon: [number, number][]): boolean => {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [x1, y1] = polygon[j];
    const [x2, y2] = polygon[i];

    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx !== 0 || dy !== 0) {
      // if ((x - x1) * dy - (y - y1) * dx === 0) {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      if ((x - x1) * dy - (y - y1) * dx === 0 && x >= minX && x <= maxX && y >= minY && y <= maxY) {
        return true;
      }
    }

    if ((y1 > y) !== (y2 > y)) {
      const atX = ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;
      if (x < atX) inside = !inside;
    }
  }

  return inside;
};

export default Puzzle.new({
  prepare: (content) => {
    return Str.lines(content).map((line) => line.split(',').map((value) => +value)) as [number, number][];
  },
  easy(corners) {
    const n = corners.length;
    let result = 0;

    for (let i = 0; i < n; ++i) {
      for (let j = i + 1; j < n; ++j) {
        const [x1, y1] = corners[i];
        const [x2, y2] = corners[j];
        if (x1 === x2 && y1 === y2) continue;

        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);

        const area = (maxX - minX + 1) * (maxY - minY + 1);
        if (area > result) result = area;
      }
    }

    return result;
  },
  hard(corners) {
    const n = corners.length;
    const findBetweens = () => {
      const result = [];

      for (let i = 0; i < n; ++i) {
        const [x1, y1] = corners[i];
        const [x2, y2] = corners[(i + 1) % n];
        if (x1 === x2 && y1 === y2) continue;

        const dx = Math.sign(x2 - x1);
        const dy = Math.sign(y2 - y1);

        let x = x1 + dx;
        let y = y1 + dy;
        while (x !== x2 || y !== y2) {
          result.push([x, y]);
          x += dx;
          y += dy;
        }
      }

      return result;
    };

    // const v = GridVisualizer.fromBounds(15, 15);
    // v.fill(colors.gray('.'));
    // v.add(corners.map(([x, y]) => [x, y, colors.gray('R')] as const));
    // v.add(betweens.map(([x, y]) => [x, y, colors.gray('X')] as const));

    const directions = corners.map((
      [x, y],
      index,
    ): [start: Vec2, index: number, directions: Vec2[]] => [
      Vec2.new(x, y),
      index,
      Neighbours.diagonals.filter(({ x: dx, y: dy }) => isInsidePolygon([x + dx, y + dy], corners)),
    ]);

    let vi = 0;
    let vj = 0;

    const candidates: [start: Vec2, index: number, corners: Vec2[]][] = [];
    for (const [start, index, directionals] of directions) {
      const cornersToCheck: Vec2[] = [];
      // console.log(start, index, directionals);

      for (const direction of directionals) {
        const value = Vec2.from(start);

        while (true) {
          value.add(direction);
          if (!isInsidePolygon(value.toArray() as [number, number], corners)) break;
          if (vi === index) {
            // v.add(value.x, value.y);
          }
          outer: for (const [x, y] of corners) {
            // bound by x and y of the start
            if (value.x !== x && value.y !== y) {
              continue;
            }

            // bound by x and y of the corner
            if (start.x === x || start.y === y) {
              continue;
            }

            // check if formed edge is on the polygon
            // if (vi === index && x === 9 && y === 7) {
            const directionX = Math.sign(x - start.x);
            const directionY = Math.sign(y - start.y);

            for (let xx = start.x + directionX; xx !== x; xx += directionX) {
              // v.add(xx, start.y, colors.green('H'));
              if (!isInsidePolygon([xx, start.y], corners)) {
                // v.add(xx, start.y, colors.red('H'));
                continue outer;
              }
            }

            for (let yy = start.y + directionY; yy !== y; yy += directionY) {
              // v.add(start.x, yy, colors.green('V'));
              if (!isInsidePolygon([start.x, yy], corners)) {
                // v.add(start.x, yy, colors.red('V'));
                continue outer;
              }
            }

            // console.log(x, y, start.x, start.y);
            // v.add(x, y, colors.green('O'));
            // v.add(start.x, start.y, colors.blue('O'));
            // }

            cornersToCheck.push(Vec2.new(x, y));
          }
        }
      }
      if (cornersToCheck.length < 1) continue;
      candidates.push([start, index, cornersToCheck]);
    }

    // {
    //   const [start, index, corners] = candidates[7];
    //   console.log(start, index, corners);
    //   v.log();
    //   v.fill();
    //   v.add([start.x, start.y, colors.red('R')]);
    //   for (const corner of corners) {
    //     v.add([corner.x, corner.y, colors.yellow('X')]);
    //   }
    //   v.log();
    // }
    let result = 0;

    console.log(candidates.length);

    return result;
  },
});
