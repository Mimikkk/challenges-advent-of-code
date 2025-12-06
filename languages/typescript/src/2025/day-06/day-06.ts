import { Puzzle } from '../../types/puzzle.ts';
import { product, sum, sumBy } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

enum Operator {
  Add = '+',
  Multiply = '*',
}

const applyOperator = (operator: Operator, values: number[]): number => {
  return operator === Operator.Add ? sum(values) : product(values);
};

export default Puzzle.new({
  easy(content) {
    const strs = Str.lines(content).map((line) => line.trim().split(/\s+/));
    const operators = strs.pop() as Operator[];
    const numbersStrs = strs;

    const operatorNumbers = numbersStrs[0].map((_, i) => numbersStrs.map((row) => Number(row[i])));

    return sumBy(operators, (operator, i) => applyOperator(operator, operatorNumbers[i]));
  },
  hard(content) {
    const strs = Str.lines(content);
    const operators = strs.pop()?.trim().split(/\s+/) as Operator[];
    const numbersStrs = strs;

    const m = numbersStrs[0].length;

    const operatorNumbers: number[][] = [];
    let numbers: number[] = [];
    for (let i = 0; i <= m; ++i) {
      const value = +numbersStrs.map((line) => line[i]).join('');

      if (value === 0) {
        operatorNumbers.push(numbers);
        numbers = [];
      } else {
        numbers.push(value);
      }
    }

    return sumBy(operators, (operator, i) => applyOperator(operator, operatorNumbers[i]));
  },
});
