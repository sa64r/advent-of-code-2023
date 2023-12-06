import { parseLines, solve } from '../utils/typescript';

const parseInput = (input: string[]) => {
  const times = input[0]
    .split('Time:')[1]
    .trim()
    .split(' ')
    .filter((time) => time !== '');
  const distances = input[1]
    .split('Distance:')[1]
    .trim()
    .split(' ')
    .filter((distance) => distance !== '');

  return {
    times: times.map((time) => parseInt(time)),
    distances: distances.map((distance) => parseInt(distance)),
  };
};

const findWaysToWin = (time: number, recordDistance: number) => {
  const ways = [];
  for (let i = 0; i < time; i++) {
    const timePushingButton = i;
    const speed = timePushingButton;
    const distanceTraveled = speed * (time - timePushingButton);

    if (distanceTraveled > recordDistance) {
      ways.push({ timePushingButton, speed, distanceTraveled });
    }
  }
  return ways;
};

function part1(_input: string[]) {
  const { times, distances } = parseInput(_input);

  const waysToWin = times.map((time, index) => {
    return findWaysToWin(time, distances[index]).length;
  });

  const product = waysToWin.reduce((acc, curr) => acc * curr, 1);

  return product;
}

function part2(_input: string[]) {
  const { times, distances } = parseInput(_input);

  const time = parseInt(times.map((t) => t.toString()).join(''));
  const distance = parseInt(distances.map((d) => d.toString()).join(''));

  const waysToWin = findWaysToWin(time, distance).length;

  return waysToWin;
}

solve({ part1, part2, parser: parseLines(), test2: 71503 });
