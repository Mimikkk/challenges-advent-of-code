export const identity = <T>(item: T): T => item;

export const sumBy = <T>(items: T[], fn: (item: T, index: number) => number): number => {
  let sum = 0;
  for (let i = 0; i < items.length; ++i) {
    sum += fn(items[i], i);
  }
  return sum;
};

export const productBy = <T>(items: T[], fn: (item: T, index: number) => number): number => {
  let product = 1;
  for (let i = 0; i < items.length; ++i) {
    product *= fn(items[i], i);
  }
  return product;
};

export const sum = (items: number[]): number => sumBy(items, identity);
export const product = (items: number[]): number => productBy(items, identity);

export const countBy = <T>(items: T[], fn: (item: T, index: number) => unknown): number => {
  let count = 0;
  for (let i = 0; i < items.length; ++i) {
    if (fn(items[i], i)) count++;
  }
  return count;
};

export const count = (items: number[]): number => countBy(items, identity);

export const maxBy = <T>(items: T[], fn: (item: T, index: number) => number): number => {
  let max = -Infinity;
  for (let i = 0; i < items.length; ++i) {
    const value = fn(items[i], i);
    if (value > max) max = value;
  }
  return max;
};
export const minBy = <T>(items: T[], fn: (item: T, index: number) => number): number => {
  let min = Infinity;
  for (let i = 0; i < items.length; ++i) {
    const value = fn(items[i], i);
    if (value < min) min = value;
  }
  return min;
};

export const desc = (a: number, b: number): number => b - a;
export const asc = (a: number, b: number): number => a - b;
