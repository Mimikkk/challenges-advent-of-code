import { createPuzzleTest } from '../../utils/create-puzzle-test.ts';
import puzzle from './day-17.ts';

createPuzzleTest({
  puzzle,
  hardTest: 117440,
  hardTestInput: 'type:input-test-hard',
  hardUser: 117440,
  skip: true,
});
