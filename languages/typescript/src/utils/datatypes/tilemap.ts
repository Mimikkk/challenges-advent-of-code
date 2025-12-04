import { Ids } from '../../types/math/Ids.ts';
import { Vec2 } from '../../types/math/Vec2.ts';

export class TileMap<T extends string> {
  static new<T extends string>(grid: T[][] = [], n: number = 0, m: number = 0): self<T> {
    return new Self(grid, n, m);
  }

  static from<T extends string>(tilemap: self<T>, into: self<T> = Self.new()): self<T> {
    return into.from(tilemap);
  }

  static fromGrid<T extends string>(grid: T[][]): self<T> {
    return new Self(grid, grid.length, grid[0]?.length ?? 0);
  }

  private constructor(public grid: T[][], public n: number, public m: number) {}

  from({ grid }: self<T>): this {
    return this.fromGrid(grid);
  }

  fromGrid(grid: T[][]): this {
    this.grid = grid.map((row) => row.slice());
    this.n = grid.length;
    this.m = grid[0]?.length ?? 0;
    return this;
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.n && y >= 0 && y < this.m;
  }

  id(x: number, y: number): number {
    return Ids.xyi32(x, y);
  }

  is(x: number, y: number, predicate: ((tile: T) => boolean) | T): boolean {
    const tile = this.at(x, y);
    if (tile === undefined) return false;
    return typeof predicate === 'function' ? predicate(tile) : tile === predicate;
  }

  at(x: number, y: number): T | undefined {
    return this.inBounds(x, y) ? this.grid[x][y] : undefined;
  }

  set(x: number, y: number, tile: T): void {
    this.grid[x][y] = tile;
  }

  find(tile: T): Vec2 | undefined {
    const { n, m, grid } = this;

    for (let i = 0; i < n; ++i) {
      const row = grid[i];
      for (let j = 0; j < m; ++j) {
        if (row[j] === tile) return Vec2.new(i, j);
      }
    }
  }

  filter(predicate: ((tile: T, x: number, y: number) => boolean) | T): Vec2[] {
    const { n, m, grid } = this;
    const isValid = typeof predicate === 'function' ? predicate : (tile: T) => tile === predicate;

    const result: Vec2[] = [];
    for (let i = 0; i < n; ++i) {
      const row = grid[i];
      for (let j = 0; j < m; ++j) {
        if (!isValid(row[j], i, j)) continue;
        result.push(Vec2.new(i, j));
      }
    }

    return result;
  }

  count(predicate: ((tile: T, x: number, y: number) => boolean) | T): number {
    const { n, m, grid } = this;
    const isValid = typeof predicate === 'function' ? predicate : (tile: T) => tile === predicate;

    let total = 0;
    for (let i = 0; i < n; ++i) {
      const row = grid[i];
      for (let j = 0; j < m; ++j) {
        if (!isValid(row[j], i, j)) continue;
        total += 1;
      }
    }

    return total;
  }
}

type self<T extends string> = TileMap<T>;
const Self = TileMap;
