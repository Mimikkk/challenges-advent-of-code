import { Neighbours } from '../../types/grids/grids.ts';
import { Ids } from '../../types/math/Ids.ts';
import { Vec2 } from '../../types/math/Vec2.ts';
import { Puzzle } from '../../types/puzzle.ts';
import { maxBy } from '../../utils/maths.ts';

const OrderedRocks: Vec2[][] = [
  [Vec2.new(0, 0), Vec2.new(1, 0), Vec2.new(2, 0), Vec2.new(3, 0)],
  [Vec2.new(1, 0), Vec2.new(0, 1), Vec2.new(1, 1), Vec2.new(2, 1), Vec2.new(1, 2)],
  [Vec2.new(0, 0), Vec2.new(1, 0), Vec2.new(2, 0), Vec2.new(2, 1), Vec2.new(2, 2)],
  [Vec2.new(0, 0), Vec2.new(0, 1), Vec2.new(0, 2), Vec2.new(0, 3)],
  [Vec2.new(0, 0), Vec2.new(1, 0), Vec2.new(0, 1), Vec2.new(1, 1)],
] as const;

const ChamberWidth = 7;

function canMoveRock(chamber: Set<number>, rock: Vec2[], offset: Vec2, jet: Vec2): boolean {
  for (const position of rock) {
    const x = offset.x + position.x + jet.x;
    const y = offset.y + position.y + jet.y;
    if (x < 0 || x >= ChamberWidth || y < 0) return false;
    if (chamber.has(Ids.n2i32(x, y))) return false;
  }
  return true;
}

function settleRock(chamber: Set<number>, rock: Vec2[], pos: Vec2): void {
  for (const position of rock) {
    const x = pos.x + position.x;
    const y = pos.y + position.y;
    chamber.add(Ids.n2i32(x, y));
  }
}

function calcHash(chamber: Set<number>, top: number): number {
  let hash = 0;
  let shift = 0;

  for (let y = top - 1, yMax = Math.max(0, top - 5); y >= yMax; y--) {
    let row = 0;
    for (let x = 0; x < ChamberWidth; x++) {
      if (chamber.has(Ids.n2i32(x, y))) {
        row |= 1 << x;
      }
    }

    hash += row << shift;
    shift += ChamberWidth;
  }

  return hash;
}

export default Puzzle.new({
  prepare: (content) =>
    content.trim().split('').map((char) => (char === '<' ? Neighbours.directions.left : Neighbours.directions.right)),
  easy(orderedJets) {
    const chamber = new Set<number>();
    let top = 0;

    const totalRockCount = 2022;
    for (let rockOffset = 0, jetOffset = 0; rockOffset < totalRockCount; ++rockOffset) {
      const activeRockPositions = OrderedRocks[rockOffset % OrderedRocks.length];
      const activeRockOffset = Vec2.new(2, top + 3);

      while (true) {
        const jet = orderedJets[jetOffset++ % orderedJets.length];

        if (canMoveRock(chamber, activeRockPositions, activeRockOffset, jet)) {
          activeRockOffset.add(jet);
        }

        if (canMoveRock(chamber, activeRockPositions, activeRockOffset, Neighbours.directions.down)) {
          activeRockOffset.add(Neighbours.directions.down);
          continue;
        }

        settleRock(chamber, activeRockPositions, activeRockOffset);

        const rockTop = maxBy(activeRockPositions, ({ y }) => activeRockOffset.y + y);
        if (rockTop + 1 > top) {
          top = rockTop + 1;
        }

        break;
      }
    }

    return top;
  },
  hard(orderedJets) {
    const chamber = new Set<number>();
    let top = 0;

    const cache = new Map<string, { rockCount: number; height: number }>();
    let wasCycle = false;

    const totalRockCount = 1_000_000_000_000;
    for (let rockOffset = 0, jetOffset = 0; rockOffset < totalRockCount; ++rockOffset) {
      const activeRockPositions = OrderedRocks[rockOffset % OrderedRocks.length];
      const activeRockOffset = Vec2.new(2, top + 3);

      while (true) {
        const jet = orderedJets[jetOffset++ % orderedJets.length];
        if (canMoveRock(chamber, activeRockPositions, activeRockOffset, jet)) {
          activeRockOffset.add(jet);
        }

        if (canMoveRock(chamber, activeRockPositions, activeRockOffset, Neighbours.directions.down)) {
          activeRockOffset.add(Neighbours.directions.down);
          continue;
        }
        settleRock(chamber, activeRockPositions, activeRockOffset);

        const rockTop = maxBy(activeRockPositions, ({ y }) => activeRockOffset.y + y);
        if (rockTop + 1 > top) {
          top = rockTop + 1;
        }

        if (wasCycle) break;

        const key = `${rockOffset % OrderedRocks.length},${jetOffset % orderedJets.length},${calcHash(chamber, top)}`;

        const previous = cache.get(key);
        if (!previous) {
          cache.set(key, { rockCount: rockOffset, height: top });
        } else {
          const cycleRockCount = rockOffset - previous.rockCount;
          const cycleHeight = top - previous.height;
          wasCycle = true;

          const remainingRockCount = totalRockCount - rockOffset - 1;
          const skipCount = Math.floor(remainingRockCount / cycleRockCount);

          const nextHeight = skipCount * cycleHeight;
          rockOffset += skipCount * cycleRockCount;

          top += nextHeight;

          const next = new Set<number>();
          for (const ids of chamber) {
            const x = Ids.i32x(ids);
            const y = Ids.i32y(ids);

            next.add(Ids.n2i32(x, y + nextHeight));
          }

          chamber.clear();
          for (const id of next) {
            chamber.add(id);
          }
        }

        break;
      }
    }

    return top;
  },
});
