import { createPuzzleTest } from '../../utils/create-puzzle-test.ts';
import puzzle from './day-01.ts';

createPuzzleTest({
  puzzle,
  easyTest: 142,
  easyUser: 55538,
  hardTest: 281,
  hardTestInput: 'type:input-test-hard',
  hardUser: 54875,
});
