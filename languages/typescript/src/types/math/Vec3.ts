import type { Const } from '../const.ts';

export class Vec3 {
  static new(x: number = 0, y: number = 0, z: number = 0): self {
    return new Vec3(x, y, z);
  }

  static from(value: Const<self>, into: self = Self.new()): self {
    return into.from(value);
  }

  static fromArray(array: number[], offset: number = 0, into: self = Self.new()): self {
    return into.fromArray(array, offset);
  }

  static fromParams(x: number, y: number, z: number, into: self = Self.new()): self {
    return into.fromParams(x, y, z);
  }

  private constructor(public x: number, public y: number, public z: number) {}

  from({ x, y, z }: Const<self>): this {
    return this.set(x, y, z);
  }

  fromArray(array: number[], offset: number = 0): this {
    return this.set(array[offset + 0], array[offset + 1], array[offset + 2]);
  }

  fromParams(x: number, y: number, z: number): this {
    return this.set(x, y, z);
  }

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  setX(x: number): this {
    this.x = x;
    return this;
  }

  setY(y: number): this {
    this.y = y;
    return this;
  }

  setZ(z: number): this {
    this.z = z;
    return this;
  }

  static add(first: Const<self>, second: Const<self>, into: self = Self.new()): self {
    return into.from(first).add(second);
  }

  add({ x, y, z }: Const<self>): this {
    return this.addXYZ(x, y, z);
  }

  addXYZ(x: number, y: number, z: number): this {
    return this.set(this.x + x, this.y + y, this.z + z);
  }

  addX(x: number): this {
    return this.setX(this.x + x);
  }

  addY(y: number): this {
    return this.setY(this.y + y);
  }

  addZ(z: number): this {
    return this.setZ(this.z + z);
  }

  static sub(first: Const<self>, second: Const<self>, into: self = Self.new()): self {
    return into.from(first).sub(second);
  }

  sub({ x, y, z }: Const<self>): this {
    return this.subXYZ(x, y, z);
  }

  subXYZ(x: number, y: number, z: number): this {
    return this.set(this.x - x, this.y - y, this.z - z);
  }

  subX(x: number): this {
    return this.setX(this.x - x);
  }

  subY(y: number): this {
    return this.setY(this.y - y);
  }

  subZ(z: number): this {
    return this.setZ(this.z - z);
  }

  static mod(first: Const<self>, second: Const<self>, into: self = Self.new()): self {
    return into.from(first).mod(second);
  }

  mod({ x, y, z }: Const<self>): this {
    return this.set(this.x % x, this.y % y, this.z % z);
  }

  modX(x: number): this {
    return this.setX(this.x % x);
  }

  modY(y: number): this {
    return this.setY(this.y % y);
  }

  modZ(z: number): this {
    return this.setZ(this.z % z);
  }

  modXYZ(x: number, y: number, z: number): this {
    return this.set(this.x % x, this.y % y, this.z % z);
  }

  static max(first: Const<self>, second: Const<self>, into: self = Self.new()): self {
    return into.from(first).max(second);
  }

  max({ x, y, z }: Const<self>): this {
    return this.set(Math.max(this.x, x), Math.max(this.y, y), Math.max(this.z, z));
  }

  maxX(x: number): this {
    return this.setX(Math.max(this.x, x));
  }

  maxY(y: number): this {
    return this.setY(Math.max(this.y, y));
  }

  maxZ(z: number): this {
    return this.setZ(Math.max(this.z, z));
  }

  maxXYZ(x: number, y: number, z: number): this {
    return this.set(Math.max(this.x, x), Math.max(this.y, y), Math.max(this.z, z));
  }

  static min(first: Const<self>, second: Const<self>, into: self = Self.new()): self {
    return into.from(first).min(second);
  }

  min({ x, y, z }: Const<self>): this {
    return this.set(Math.min(this.x, x), Math.min(this.y, y), Math.min(this.z, z));
  }

  minX(x: number): this {
    return this.setX(Math.min(this.x, x));
  }

  minY(y: number): this {
    return this.setY(Math.min(this.y, y));
  }

  minZ(z: number): this {
    return this.setZ(Math.min(this.z, z));
  }

  minXYZ(x: number, y: number, z: number): this {
    return this.set(Math.min(this.x, x), Math.min(this.y, y), Math.min(this.z, z));
  }

  static euclideanSquared(first: Const<self>, second: Const<self>): number {
    return first.euclideanSquared(second);
  }

  euclideanSquared({ x, y, z }: Const<self>): number {
    return (this.x - x) * (this.x - x) + (this.y - y) * (this.y - y) + (this.z - z) * (this.z - z);
  }

  static euclidean(first: Const<self>, second: Const<self>): number {
    return first.euclidean(second);
  }

  euclidean(other: Const<self>): number {
    return Math.sqrt(this.euclideanSquared(other));
  }

  static manhattan(first: Const<self>, second: Const<self>): number {
    return first.manhattan(second);
  }

  manhattan({ x, y, z }: Const<self>): number {
    return Math.abs(this.x - x) + Math.abs(this.y - y) + Math.abs(this.z - z);
  }

  static equals(first: Const<self>, second: Const<self>): boolean {
    return first.equals(second);
  }

  equals({ x, y, z }: Const<self>): boolean {
    return this.x === x && this.y === y && this.z === z;
  }

  clone(into: self = Self.new()): self {
    return into.from(this);
  }

  toArray(offset: number = 0, into: number[] = []) {
    into[offset + 0] = this.x;
    into[offset + 1] = this.y;
    into[offset + 2] = this.z;
    return into;
  }

  toString(): string {
    return `Vec3 { x: ${this.x}, y: ${this.y}, z: ${this.z} }`;
  }
}

type self = Vec3;
const Self = Vec3;
