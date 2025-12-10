import { Puzzle } from '../../types/puzzle.ts';
import { sum, sumBy } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

const EPSILON = 1e-9;

type ConstraintRelation = '<=' | '>=' | '=';
type OptimizationDirection = 'min' | 'max';

type Constraint = {
  relation: ConstraintRelation;
  equals: number;
  coefficients: number[];
};

type Objective = {
  direction: OptimizationDirection;
  coefficients: number[];
};

type LinearProgramModel = {
  variableCount: number;
  objective: Objective;
  constraints: Constraint[];
};

type SimplexResult = {
  status: 'optimal' | 'unbounded';
};

type LinearProgramResult = {
  ok: false;
} | {
  ok: true;
  solution: number[];
  objective: number;
};

type TableauData = {
  tableau: number[][];
  basis: number[];
  totalVars: number;
  equalsColumn: number;
  numOriginalVars: number;
  artificialStart: number;
  artificialCount: number;
  phaseOneNeeded: boolean;
};

const cloneModelWithConstraint = (
  model: LinearProgramModel,
  varIndex: number,
  relation: ConstraintRelation,
  equals: number,
): LinearProgramModel => {
  const result = structuredClone(model);
  const coefficients = Array.from<number>({ length: result.variableCount }).fill(0);

  coefficients[varIndex] = 1;
  result.constraints.push({ relation, equals, coefficients: coefficients });

  return result;
};

const createTableau = (model: LinearProgramModel): TableauData => {
  const variableCount = model.variableCount;
  const constraints = model.constraints;
  const constraintCount = constraints.length;

  let slackCount = 0;
  let artificialCount = 0;
  constraints.forEach((constraint) => {
    if (constraint.relation === '<=') {
      slackCount++;
    } else if (constraint.relation === '>=') {
      slackCount++;
      artificialCount++;
    } else if (constraint.relation === '=') {
      artificialCount++;
    }
  });

  const totalVariableCount = variableCount + slackCount + artificialCount;
  const equalsColumn = totalVariableCount;

  const tableau: number[][] = Array.from(
    { length: constraintCount + 1 },
    () => Array.from<number>({ length: totalVariableCount + 1 }).fill(0),
  );
  const basis: number[] = Array.from<number>({ length: constraintCount }).fill(-1);

  let slackOffset = variableCount;
  let artificialOffset = variableCount + slackCount;
  const slackIndices: (number | null)[] = Array.from<number | null>({ length: constraintCount }).fill(null);
  const artificialIndices: (number | null)[] = Array.from<number | null>({ length: constraintCount }).fill(null);

  for (let rowIndex = 0; rowIndex < constraints.length; rowIndex++) {
    const constraint = constraints[rowIndex];
    const row = tableau[rowIndex];

    for (let colIndex = 0; colIndex < constraint.coefficients.length; colIndex++) {
      row[colIndex] = constraint.coefficients[colIndex];
    }

    if (constraint.relation === '<=') {
      const i = slackOffset++;
      slackIndices[rowIndex] = i;
      row[i] = 1;
      basis[rowIndex] = i;
    } else if (constraint.relation === '>=') {
      const slackIndex = slackOffset++;
      const artificialIndex = artificialOffset++;

      slackIndices[rowIndex] = slackIndex;
      artificialIndices[rowIndex] = artificialIndex;

      row[slackIndex] = -1;
      row[artificialIndex] = 1;
      basis[rowIndex] = artificialIndex;
    } else if (constraint.relation === '=') {
      const artificialIndex = artificialOffset++;
      artificialIndices[rowIndex] = artificialIndex;

      row[artificialIndex] = 1;
      basis[rowIndex] = artificialIndex;
    }

    row[equalsColumn] = constraint.equals;
  }

  return {
    tableau,
    basis,
    totalVars: totalVariableCount,
    equalsColumn,
    numOriginalVars: variableCount,
    artificialStart: variableCount + slackCount,
    artificialCount,
    phaseOneNeeded: artificialCount > 0,
  };
};

const pivot = (tableau: number[][], basis: number[], pivotRow: number, pivotCol: number): void => {
  const width = tableau[0].length;
  const pivotValue = tableau[pivotRow][pivotCol];

  for (let col = 0; col < width; col++) {
    tableau[pivotRow][col] /= pivotValue;
  }

  for (let row = 0; row < tableau.length; row++) {
    if (row === pivotRow) continue;
    const factor = tableau[row][pivotCol];

    if (Math.abs(factor) < EPSILON) continue;

    for (let col = 0; col < width; col++) {
      tableau[row][col] -= factor * tableau[pivotRow][col];
    }
  }

  basis[pivotRow] = pivotCol;
};

const simplex = (tableau: number[][], basis: number[], columnCount: number): SimplexResult => {
  const rows = tableau.length;
  const equalsColumn = tableau[0].length - 1;
  while (true) {
    let entering = -1;
    let mostNegative = -EPSILON;

    for (let col = 0; col < columnCount; col++) {
      const value = tableau[rows - 1][col];
      if (value < mostNegative) {
        mostNegative = value;
        entering = col;
      }
    }

    if (entering === -1) {
      return { status: 'optimal' };
    }

    let leaving = -1;
    let bestRatio = Infinity;

    for (let row = 0; row < rows - 1; row++) {
      const coefficient = tableau[row][entering];

      if (coefficient > EPSILON) {
        const ratio = tableau[row][equalsColumn] / coefficient;
        if (ratio < bestRatio - EPSILON) {
          bestRatio = ratio;
          leaving = row;
        }
      }
    }

    if (leaving === -1) {
      return { status: 'unbounded' };
    }

    pivot(tableau, basis, leaving, entering);
  }
};

const setObjectiveRow = (tableau: number[][], basis: number[], coefficients: number[], columnCount: number): void => {
  const rows = tableau.length;
  const equalsColumn = tableau[0].length - 1;
  const lastRow = rows - 1;
  for (let col = 0; col < columnCount; col++) {
    tableau[lastRow][col] = -(coefficients[col] || 0);
  }
  tableau[lastRow][equalsColumn] = 0;
  for (let row = 0; row < rows - 1; row++) {
    const basicVar = basis[row];
    if (basicVar == null || basicVar < 0) continue;
    const coefficient = coefficients[basicVar] || 0;
    if (Math.abs(coefficient) < EPSILON) continue;

    for (let col = 0; col <= equalsColumn; ++col) {
      tableau[lastRow][col] += coefficient * tableau[row][col];
    }
  }
};

const eliminateArtificialVariables = (
  tableau: number[][],
  basis: number[],
  artificialStart: number,
  _columnCount: number,
): void => {
  for (let row = 0; row < basis.length; row++) {
    const variableIndex = basis[row];
    if (variableIndex < artificialStart) continue;

    let entering = -1;
    for (let col = 0; col < artificialStart; col++) {
      if (Math.abs(tableau[row][col]) <= EPSILON) continue;
      entering = col;
      break;
    }
    if (entering !== -1) {
      pivot(tableau, basis, row, entering);
      continue;
    }
    basis[row] = -1;
  }
};

const removeArtificialColumns = (tableau: number[][], columnCount: number, artificialStart: number): number[][] => {
  if (columnCount === artificialStart) {
    return tableau;
  }
  const equalsColumn = columnCount;

  const keepColumns: number[] = [];
  for (let col = 0; col < artificialStart; col++) {
    keepColumns.push(col);
  }

  keepColumns.push(equalsColumn);
  return tableau.map((row) => keepColumns.map((col) => row[col]));
};

const extractSolution = (tableau: number[][], basis: number[], variableCount: number): number[] => {
  const equalsColumn = tableau[0].length - 1;

  const result = Array.from<number>({ length: variableCount }).fill(0);

  for (let i = 0; i < basis.length; ++i) {
    const j = basis[i];

    if (j < 0 || j >= variableCount) continue;
    result[j] = tableau[i][equalsColumn];
  }

  return result;
};

const solveLinearProgram = (model: LinearProgramModel): LinearProgramResult => {
  const normalized = structuredClone(model);
  const prepared = createTableau(normalized);
  let { tableau, basis, totalVars, equalsColumn, numOriginalVars, artificialStart, phaseOneNeeded } = prepared;

  const rows = tableau.length;

  if (phaseOneNeeded) {
    const phaseOnecoefficients = Array.from<number>({ length: totalVars }).fill(0);

    for (let col = artificialStart; col < totalVars; col++) {
      phaseOnecoefficients[col] = -1;
    }

    setObjectiveRow(tableau, basis, phaseOnecoefficients, totalVars);

    const phaseOneResult = simplex(tableau, basis, totalVars);
    if (phaseOneResult.status !== 'optimal') {
      return { ok: false };
    }

    const phaseOneValue = tableau[rows - 1][equalsColumn];
    if (Math.abs(phaseOneValue) > EPSILON) {
      return { ok: false };
    }

    eliminateArtificialVariables(tableau, basis, artificialStart, totalVars);
    tableau = removeArtificialColumns(tableau, totalVars, artificialStart);
    totalVars = artificialStart;
    equalsColumn = totalVars;
  } else {
    for (let col = 0; col <= equalsColumn; col++) {
      tableau[rows - 1][col] = 0;
    }
  }

  const maximizingcoefficients = Array.from<number>({ length: totalVars }).fill(0);

  const originalObjective = normalized.objective.coefficients;
  for (let col = 0; col < numOriginalVars; col++) {
    maximizingcoefficients[col] = -(originalObjective[col] ?? 0);
  }

  setObjectiveRow(tableau, basis, maximizingcoefficients, totalVars);

  const phaseTwoResult = simplex(tableau, basis, totalVars);

  if (phaseTwoResult.status !== 'optimal') {
    return { ok: false };
  }

  const solution = extractSolution(tableau, basis, numOriginalVars);
  const objective = -tableau[rows - 1][equalsColumn];

  return { ok: true, solution, objective: objective };
};

const findFractionalIndex = (values: number[]): number => {
  let result = -1;
  let bestFractional = 0;

  for (let i = 0; i < values.length; ++i) {
    const value = values[i];

    const fractional = Math.abs(value - Math.round(value));
    if (fractional > EPSILON && fractional > bestFractional) {
      bestFractional = fractional;
      result = i;
    }
  }

  return result;
};

const solveIntegerProgram = (model: LinearProgramModel): LinearProgramResult => {
  const normalized = structuredClone(model);
  let bestSolution: { solution: number[]; objective: number } | null = null;

  const branch = (currentModel: LinearProgramModel): void => {
    const lpResult = solveLinearProgram(currentModel);
    if (!lpResult.ok) {
      return;
    }
    if (bestSolution && lpResult.objective >= bestSolution.objective - EPSILON) {
      return;
    }
    const fractionalIndex = findFractionalIndex(lpResult.solution);
    if (fractionalIndex === -1) {
      if (!bestSolution || lpResult.objective < bestSolution.objective - EPSILON) {
        bestSolution = { solution: lpResult.solution, objective: lpResult.objective };
      }
      return;
    }

    const value = lpResult.solution[fractionalIndex];
    const floorValue = Math.floor(value);
    const ceilValue = Math.ceil(value);

    if (floorValue >= 0) {
      const leftModel = cloneModelWithConstraint(currentModel, fractionalIndex, '<=', floorValue);
      branch(leftModel);
    }
    const rightModel = cloneModelWithConstraint(currentModel, fractionalIndex, '>=', ceilValue);
    branch(rightModel);
  };

  branch(normalized);
  if (!bestSolution) {
    return { ok: false };
  }
  const finalSolution = bestSolution as { solution: number[]; objective: number };
  return {
    ok: true,
    solution: finalSolution.solution,
    objective: finalSolution.objective,
  };
};

export default Puzzle.new({
  prepare: (content) =>
    Str.lines(content).map((line) => {
      const strs = line.split(' ').map((s) => s.substring(1, s.length - 1));
      const diagramStr = strs.shift()!;
      const diagram = diagramStr.split('').map((c) => c === '#');
      const joltage = strs.pop()!.split(',').map((n) => +n);
      const buttons = strs.map((s) => s.split(',').map((n) => +n));

      return { diagram, buttons, joltage };
    }),
  easy(machines) {
    return sumBy(machines, ({ diagram, buttons }) => {
      const startState = diagram.map(() => false);
      const stateKey = (state: boolean[]): string => state.join(',');

      const isExpectedState = (state: boolean[], expected: boolean[]): boolean => {
        for (let i = 0; i < state.length; ++i) {
          if (state[i] !== expected[i]) return false;
        }
        return true;
      };

      const toggleState = (state: boolean[], button: number[]): boolean[] => {
        const result = [...state];
        for (const i of button) {
          result[i] = !result[i];
        }
        return result;
      };

      const queue: [state: boolean[], presses: number][] = [[startState, 0]];
      const visited = new Set<string>();
      visited.add(stateKey(startState));

      while (queue.length) {
        const [currentState, presses] = queue.shift()!;

        if (isExpectedState(currentState, diagram)) {
          return presses;
        }

        for (const button of buttons) {
          const nextState = toggleState(currentState, button);
          const key = stateKey(nextState);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push([nextState, presses + 1]);
          }
        }
      }

      return Infinity;
    });
  },
  hard(machines) {
    return sumBy(machines, (machine) => {
      const targets = machine.joltage;

      const buttons = machine.buttons.map((buttons) => {
        const effect = Array(targets.length).fill(0);
        for (const button of buttons) {
          effect[button] = 1;
        }
        return effect;
      });

      const constraints: Constraint[] = [];
      for (let i = 0; i < targets.length; ++i) {
        const coefficients = buttons.map((button) => button[i] || 0);
        constraints.push({ relation: '=', equals: targets[i], coefficients: coefficients });
      }

      for (let i = 0; i < buttons.length; ++i) {
        const coefficients = Array.from<number>({ length: buttons.length }).fill(0);
        coefficients[i] = 1;
        constraints.push({ relation: '>=', equals: 0, coefficients: coefficients });
      }

      const result = solveIntegerProgram({
        variableCount: buttons.length,
        objective: { direction: 'min', coefficients: Array(buttons.length).fill(1) },
        constraints,
      });

      if (!result.ok) return 0;
      return sum(result.solution.map(Math.round));
    });
  },
});
