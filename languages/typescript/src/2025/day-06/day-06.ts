import { Puzzle } from '../../types/puzzle.ts';
import { sumBy } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

enum Operator {
  Add = '+',
  Multiply = '*',
}

export default Puzzle.new({
  easy(content) {
    const lines = Str.lines(content).map((line) => line.trim().split(/\s+/gi));
    const [operators] = lines.splice(lines.length - 1, 1) as [Operator[]];

    const numbers = lines.map((line) => line.map((num) => +num));

    return sumBy(operators, (operator, index) => {
      let result = operator === Operator.Add ? 0 : 1;
      for (let i = 0; i < numbers.length; ++i) {
        const number = numbers[i][index];

        if (operator === Operator.Add) {
          result += number;
        } else {
          result *= number;
        }
      }

      return result;
    });
  },
  hard(content) {
    const lines = Str.lines(content);
    const [operatorsStr] = lines.splice(lines.length - 1, 1);
    const numbersStrs = lines.map((line) => line);
    const n = numbersStrs.length;
    const m = numbersStrs[0].length;

    const numbers: number[][] = [[]];
    for (let j = 0; j < m; ++j) {
      const numberCharacters = [];

      for (let i = 0; i < n; ++i) {
        const character = numbersStrs[i][j];
        if (character === ' ') continue;

        numberCharacters.push(character);
      }
      const value = +numberCharacters.join('');
      if (value === 0) {
        numbers.push([]);
        continue;
      }

      numbers.at(-1)?.push(value);
    }

    const operators = operatorsStr.trim().split(/\s+/).map((character) => character as Operator);

    return sumBy(operators, (operator, index) => {
      let result = operator === Operator.Add ? 0 : 1;
      for (let i = 0; i < numbers[index].length; ++i) {
        const number = numbers[index][i];

        if (operator === Operator.Add) {
          result += number;
        } else {
          result *= number;
        }
      }

      return result;
    });
  },
});
