import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { urlOf } from './url-of.ts';

describe('Library - aoc - utils - urlOf', () => {
  it('urlOf', () => {
    expect(urlOf(2022, 1, 'input-test')).toEqual(new URL('../2022/resources/day-01/input-test.txt', import.meta.url));
  });
});
