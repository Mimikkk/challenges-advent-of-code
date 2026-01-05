import type { Const } from '../../types/const.ts';
import { Neighbours3 } from '../../types/grids/grids.ts';
import { Ids } from '../../types/math/Ids.ts';
import { Vec3 } from '../../types/math/Vec3.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { Str } from '../../utils/strs.ts';

export default Puzzle.new({
  prepare: (content: string) =>
    Str.lines(content)
      .filter(Boolean)
      .map((line) => line.split(',').map(Number))
      .map(([x, y, z]) => Vec3.new(x, y, z)),
  easy(positions) {
    const cubes = new Set<number>();
    for (const position of positions) {
      cubes.add(Ids.v3i32(position));
    }

    const vec = Vec3.new();
    let result = 0;
    for (const position of positions) {
      for (const neighbour of Neighbours3.orthogonals) {
        const next = vec.from(position).add(neighbour);
        if (!cubes.has(Ids.v3i32(next))) ++result;
      }
    }
    return result;
  },
  hard(positions) {
    const cubes = new Set<number>();
    const min = Vec3.new(Infinity, Infinity, Infinity);
    const max = Vec3.new(-Infinity, -Infinity, -Infinity);

    for (const position of positions) {
      cubes.add(Ids.v3i32(position));
      min.min(position);
      max.max(position);
    }
    min.subXYZ(1, 1, 1);
    max.addXYZ(1, 1, 1);

    const visited = new Set<number>();
    const queue: Const<Vec3>[] = [min];

    let result = 0;
    const vec = Vec3.new();

    while (queue.length > 0) {
      const active = queue.shift()!;
      const vid = Ids.v3i32(active);
      if (visited.has(vid)) continue;
      visited.add(vid);

      for (const neighbour of Neighbours3.orthogonals) {
        const next = vec.from(active).add(neighbour);
        if (!Vec3.inBounds(next, min, max)) {
          continue;
        }

        const id = Ids.v3i32(next);
        if (cubes.has(id)) {
          ++result;
        } else if (!visited.has(id)) {
          queue.push(next.clone());
        }
      }
    }
    return result;
  },
});
