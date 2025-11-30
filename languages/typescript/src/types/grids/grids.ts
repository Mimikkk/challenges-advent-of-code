import type { Const } from '../const.ts';
import { Vec2 } from '../math/Vec2.ts';

export class Neighbours {
  /** up-left, up, up-right, left, right, down-left, down, down-right */
  static all: Const<Vec2[]> = [
    Vec2.new(-1, -1),
    Vec2.new(-1, 0),
    Vec2.new(-1, 1),
    Vec2.new(0, -1),
    Vec2.new(0, 1),
    Vec2.new(1, -1),
    Vec2.new(1, 0),
    Vec2.new(1, 1),
  ];
  /** diagonals: up-left, up-right, down-left, down-right */
  static diagonals: Const<Vec2[]> = [
    Vec2.new(-1, -1),
    Vec2.new(-1, 1),
    Vec2.new(1, -1),
    Vec2.new(1, 1),
  ];

  /** left, right, up, down */
  static orthogonals: Const<Vec2[]> = [
    Vec2.new(0, 1),
    Vec2.new(1, 0),
    Vec2.new(0, -1),
    Vec2.new(-1, 0),
  ];
}
