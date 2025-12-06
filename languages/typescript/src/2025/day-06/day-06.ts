import { Puzzle } from '../../types/puzzle.ts';
import { product, sum, sumBy } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

enum Operator {
  Add = '+',
  Multiply = '*',
}

export default Puzzle.new({
  easy(content) {
    const lines = Str.lines(content).map((line) => line.trim().split(/\s+/));

    const operators = lines.pop() ?? [];
    const numbers = lines.map((line) => line.map(Number));

    return sumBy(
      operators.map((operator, i) => ({
        method: operator === Operator.Add ? sum : product,
        values: numbers.map((values) => values[i]),
      })),
      ({ method, values }) => method(values),
    );
  },
  hard(content) {
    const lines = Str.lines(content);
    const operators = lines.pop()?.trim().split(/\s+/) ?? [];

    const m = lines[0]?.length ?? 0;

    const operatorsNumbers: number[][] = [];
    let operatorNumbers: number[] = [];

    for (let y = 0; y < m; ++y) {
      const columnDigits = lines
        .map((line) => line[y])
        .filter((char) => char !== ' ')
        .join('');

      const value = Number(columnDigits);
      if (value === 0) {
        if (operatorNumbers.length) {
          operatorsNumbers.push(operatorNumbers);
          operatorNumbers = [];
        }
      } else if (columnDigits) {
        operatorNumbers.push(value);
      }
    }
    if (operatorNumbers.length) operatorsNumbers.push(operatorNumbers);

    return sumBy(
      operators
        .map((operator, i) => ({
          method: operator === Operator.Add ? sum : product,
          values: operatorsNumbers[i],
        })),
      ({ method, values }) => method(values),
    );
  },
});
