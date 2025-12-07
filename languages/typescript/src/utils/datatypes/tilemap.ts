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

  inBounds(position: Vec2): boolean;
  inBounds(x: number, y: number): boolean;
  inBounds(x: number | Vec2, y?: number): boolean {
    if (typeof x === 'object') return this.inBounds(x.x, x.y!);
    return x >= 0 && x < this.n && y! >= 0 && y! < this.m;
  }

  id(position: Vec2): number;
  id(x: number, y: number): number;
  id(x: number | Vec2, y?: number): number {
    if (typeof x === 'object') return Ids.v2i32(x);
    return Ids.xyi32(x, y!);
  }

  is(position: Vec2, predicate: ((tile: T) => boolean) | T): boolean;
  is(x: number, y: number, predicate: ((tile: T) => boolean) | T): boolean;
  is(x: number | Vec2, y?: number | ((tile: T) => boolean) | T, predicate?: ((tile: T) => boolean) | T): boolean {
    if (typeof x === 'object') return this.is(x.x, x.y!, y as ((tile: T) => boolean) | T);

    const tile = this.at(x, y as number);
    if (tile === undefined) return false;
    return typeof predicate === 'function' ? predicate(tile) : tile === predicate;
  }

  at(position: Vec2): T | undefined;
  at(x: number, y: number): T | undefined;
  at(x: number | Vec2, y?: number): T | undefined {
    if (typeof x === 'object') return this.at(x.x, x.y!);
    return this.inBounds(x, y!) ? this.grid[x][y!] : undefined;
  }

  set(position: Vec2, tile: T): void;
  set(x: number, y: number, tile: T): void;
  set(x: number | Vec2, y?: number | T, tile?: T): void {
    if (typeof x === 'object') return this.set(x.x, x.y!, tile!);
    this.grid[x!][y! as number] = tile!;
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
