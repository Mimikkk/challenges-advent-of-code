import { Puzzle } from '../../types/puzzle.ts';
import { product } from '../../utils/maths.ts';
import { Str } from '../../utils/strs.ts';

interface Race {
  time: number;
  record: number;
}
const parseAsRaces = (content: string): Race[] => {
  const [timesStr, distancesStr] = content.split('\n').map(Str.trim);

  const times = timesStr.split('Time:')[1].trim().split(/\s+/).map(Number);
  const records = distancesStr.split('Distance:')[1].trim().split(/\s+/).map(Number);

  return times.map((time, index) => ({ time, record: records[index] }));
};

const parseAsRace = (content: string): Race => {
  const [timesStr, distancesStr] = content.split('\n').map(Str.trim);

  const time = +timesStr.split('Time:')[1].replace(/\s/g, '');
  const record = +distancesStr.split('Distance:')[1].replace(/\s/g, '');

  return { time, record };
};

const countWaysToBeatRaceRecord = ({ time, record }: Race): number => {
  const discriminant = time * time - 4 * record;
  if (discriminant <= 0) return 0;

  const sqrtDiscriminant = Math.sqrt(discriminant);
  const root1 = (time - sqrtDiscriminant) / 2;
  const root2 = (time + sqrtDiscriminant) / 2;

  const minSpeedInteger = Math.floor(root1) + 1;
  const maxSpeedInteger = Math.ceil(root2) - 1;

  return Math.max(0, maxSpeedInteger - minSpeedInteger + 1);
};

export default Puzzle.new({
  easy: {
    prepare: parseAsRaces,
    task(races) {
      return product(races.map(countWaysToBeatRaceRecord));
    },
  },
  hard: {
    prepare: parseAsRace,
    task: countWaysToBeatRaceRecord,
  },
});
