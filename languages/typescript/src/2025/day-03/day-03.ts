import { Puzzle } from '../../types/puzzle.ts';
import { Str } from '../../utils/strs.ts';

export default Puzzle.new({
  prepare: (content) => Str.lines(content).map((line) => line.split('').map(Number)),
  easy: (banks) => {
    let result = 0;

    for (const bank of banks) {
      let max = -1;

      for (let i = 0; i < bank.length - 1; ++i) {
        for (let j = i + 1; j < bank.length; ++j) {
          const val = bank[i] * 10 + bank[j];

          if (val > max) max = val;
        }
      }

      result += max;
    }

    return result;
  },
  hard: (banks) => {
    const targetLength = 12;
    let result = 0;

    for (const bank of banks) {
      const selected: number[] = [];
      let startIndex = 0;

      for (let i = 0; i < targetLength; ++i) {
        const remaining = targetLength - i - 1;
        const endIndex = bank.length - remaining;
        let bestDigit = -1;
        let bestIndex = startIndex;

        for (let j = startIndex; j < endIndex; ++j) {
          if (bank[j] > bestDigit) {
            bestDigit = bank[j];
            bestIndex = j;
          }
        }

        selected.push(bestDigit);
        startIndex = bestIndex + 1;
      }

      result += +selected.join('');
    }

    return result;
  },
});
