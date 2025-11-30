import { Puzzle } from '../../types/puzzle.ts';
import { sum } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

type CubeType = 'blue' | 'green' | 'red';
type CubeCountRecord = Record<CubeType, number>;
type Game = Partial<CubeCountRecord>[];

const parseGames = (gameStrs: string[]): Game[] =>
  gameStrs.map((gameStr) =>
    gameStr.split(':')[1].split(';').map((roundStr) =>
      Object.fromEntries(
        roundStr
          .split(',')
          .map((value) => value.split(' ').filter(Boolean))
          .map(([count, type]) => [type, +count]),
      )
    )
  ) as Game[];

const isGamePossible = (game: Game): boolean => {
  for (const { red, green, blue } of game) {
    if (red && red > 12) return false;
    if (green && green > 13) return false;
    if (blue && blue > 14) return false;
  }

  return true;
};

const findGameLeastCubeCounts = (game: Game): CubeCountRecord => {
  const result = { red: 0, green: 0, blue: 0 };

  for (const { red, green, blue } of game) {
    if (red && red > result.red) result.red = red;
    if (green && green > result.green) result.green = green;
    if (blue && blue > result.blue) result.blue = blue;
  }

  return result;
};

const findGamePower = (game: Game): number => {
  const { blue, green, red } = findGameLeastCubeCounts(game);
  return blue * green * red;
};

export default Puzzle.new({
  prepare: (text) => parseGames(Str.lines(text)),
  easy(games) {
    return sum(games.map((game, i) => isGamePossible(game) ? i + 1 : 0));
  },
  hard(games) {
    return sum(games.map(findGamePower));
  },
});
