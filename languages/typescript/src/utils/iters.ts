export namespace Iters {
  export const count = <T>(iterable: Iterable<T>, predicate: (value: T) => boolean) => {
    let count = 0;

    for (const value of iterable) {
      if (!predicate(value)) continue;
      count += 1;
    }

    return count;
  };

  export const total = <T>(iterable: Iterable<T>) => {
    let total = 0;

    for (const _ of iterable) {
      total += 1;
    }

    return total;
  };
}
