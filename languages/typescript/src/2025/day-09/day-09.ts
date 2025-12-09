import { colors } from '@cliffy/ansi/colors';
import { Neighbours } from '../../types/grids/grids.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { Str } from '../../utils/strs.ts';
import { GridVisualizer } from '../../visualizers/grid.ts';

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

const isInsidePoylgon = ([x, y]: [number, number], polygon: [number, number][]): boolean => {
  let result = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [x1, y1] = polygon[i];
    const [x2, y2] = polygon[j];

    const intersects = (y1 > y) !== (y2 > y) && (x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1);
    if (intersects) result = !result;
  }

  return result;
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
    const betweens = findBetweens();

    const v = GridVisualizer.fromBounds(13, 9);
    v.fill(colors.gray('.'));
    v.add(corners.map(([x, y]) => [x, y, colors.red('R')] as const));
    v.add(betweens.map(([x, y]) => [x, y, colors.gray('X')] as const));

    const cornerDiagonals = corners.flatMap(([x, y]) =>
      Neighbours.diagonals.map(({ x: dx, y: dy }) => [x + dx, y + dy] as [number, number])
    );

    const insideCornerDiagonals = cornerDiagonals.filter((vertex) => isInsidePoylgon(vertex, corners));

    v.add(insideCornerDiagonals.map(([x, y]) => [x, y, colors.yellow('I')] as const));
    v.log();

    let result = 0;

    // for (let i = 0; i < n; ++i) {
    //   for (let j = i + 1; j < n; ++j) {
    //     const [x1, y1] = corners[i];
    //     const [x2, y2] = corners[j];
    //     if (x1 === x2 && y1 === y2) continue;

    //     const minX = Math.min(x1, x2);
    //     const maxX = Math.max(x1, x2);
    //     const minY = Math.min(y1, y2);
    //     const maxY = Math.max(y1, y2);

    //     const area = (maxX - minX + 1) * (maxY - minY + 1);
    //     if (area > result) result = area;
    //   }
    // }

    return result;
  },
});
