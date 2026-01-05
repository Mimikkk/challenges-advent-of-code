import type { Const } from '../const.ts';
import { Vec2 } from '../math/Vec2.ts';
import { Vec3 } from '../math/Vec3.ts';

export enum Direction2 {
  Left = 'left',
  Right = 'right',
  Up = 'up',
  Down = 'down',
  DownLeft = 'downLeft',
  DownRight = 'downRight',
  UpLeft = 'upLeft',
  UpRight = 'upRight',
}

export class Neighbours2 {
  static directions: Record<Direction2, Const<Vec2>> = {
    down: Vec2.new(0, -1),
    up: Vec2.new(0, 1),
    left: Vec2.new(-1, 0),
    right: Vec2.new(1, 0),
    downLeft: Vec2.new(-1, -1),
    downRight: Vec2.new(1, -1),
    upLeft: Vec2.new(-1, 1),
    upRight: Vec2.new(1, 1),
  };

  static all: Const<Vec2[]> = [
    Neighbours2.directions.downLeft,
    Neighbours2.directions.downRight,
    Neighbours2.directions.upLeft,
    Neighbours2.directions.upRight,
    Neighbours2.directions.left,
    Neighbours2.directions.right,
    Neighbours2.directions.down,
    Neighbours2.directions.up,
  ];

  static diagonals: Const<Vec2[]> = [
    Neighbours2.directions.downLeft,
    Neighbours2.directions.downRight,
    Neighbours2.directions.upLeft,
    Neighbours2.directions.upRight,
  ];

  static orthogonals: Const<Vec2[]> = [
    Neighbours2.directions.down,
    Neighbours2.directions.up,
    Neighbours2.directions.left,
    Neighbours2.directions.right,
  ];
}

export enum Direction3 {
  DownLeftFront = 'downLeftFront',
  DownRightFront = 'downRightFront',
  UpLeftFront = 'upLeftFront',
  UpRightFront = 'upRightFront',
  Left = 'left',
  Right = 'right',
  Down = 'down',
  Up = 'up',
}

export class Neighbours3 {
  /** up-left-front, up, up-right-front, left, right, down-left-front, down, down-right-front */
  static all: Const<Vec3[]> = [
    Vec3.new(-1, -1, -1),
    Vec3.new(-1, 0, -1),
    Vec3.new(-1, 1, -1),
    Vec3.new(0, -1, -1),
    Vec3.new(0, 1, -1),
    Vec3.new(1, -1, -1),
    Vec3.new(1, 0, -1),
    Vec3.new(1, 1, -1),
  ];

  static orthogonals: Const<Vec3[]> = [
    Vec3.new(0, 0, -1),
    Vec3.new(0, 0, 1),
    Vec3.new(0, -1, 0),
    Vec3.new(0, 1, 0),
    Vec3.new(-1, 0, 0),
    Vec3.new(1, 0, 0),
  ];
}
