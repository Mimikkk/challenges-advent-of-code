import { Puzzle } from '../../types/puzzle.ts';
import { Iters } from '../../utils/iters.ts';
import { sum } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

const numberRe = /\d+/g;
const parseCards = (input: string) =>
  Str.lines(input)
    .map((line) => {
      const valuesStr = line.split(':')[1];
      const [cardValuesStr, userValuesStr] = valuesStr.split('|');
      const cardValues = cardValuesStr.match(numberRe)!;
      const userValues = userValuesStr.match(numberRe)!;

      return [cardValues, userValues];
    })
    .map(([card, user]) => countMatches(card, user));

const countMatches = (card: string[], user: string[]) => Iters.count(card, (v) => user.includes(v));

export default Puzzle.new({
  prepare: parseCards,
  easy(counts) {
    return sum(counts.map((count) => (count ? 1 << (count - 1) : 0)));
  },

  hard(counts) {
    const cards = counts.map((count) => ({ occurences: 1, count }));

    let total = 0;
    for (let i = 0; i < cards.length; ++i) {
      const { occurences, count } = cards[i];

      for (let j = i + 1, it = i + count + 1; j < it; ++j) {
        cards[j].occurences += occurences;
      }

      total += occurences;
    }

    return total;
  },
});
