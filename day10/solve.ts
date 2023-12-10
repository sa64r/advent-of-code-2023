import { parseLines, solve } from '../utils/typescript';

/* 
KEY:
| - vertical pie
- - horizontal pie
F - bend south to east
7 - bend south to west
J - bend north to west
L - bend north to east
. - empty ground
S - start
*/

type QueueItem = {
  x: number;
  y: number;
  char: string;
  prevX: number;
  prevY: number;
  steps: number;
};

const findStart = (input: string[]) => {
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === 'S') {
        return { x, y };
      }
    }
  }
  throw new Error('No start found');
};

const findValidDirectionsOnStart = (
  startCoordinates: { x; y },
  map: string[][],
) => {
  const { x, y } = startCoordinates;

  const north = map[y - 1][x];
  const south = map[y + 1][x];
  const east = map[y][x + 1];
  const west = map[y][x - 1];

  const validDirections: QueueItem[] = [];

  if (north === '|' || north === 'F' || north === '7') {
    validDirections.push({
      x,
      y: y - 1,
      char: north,
      prevX: x,
      prevY: y,
      steps: 1,
    });
  }
  if (south === '|' || south === 'L' || south === 'J') {
    validDirections.push({
      x,
      y: y + 1,
      char: south,
      prevX: x,
      prevY: y,
      steps: 1,
    });
  }
  if (east === '-' || east === '7' || east === 'J') {
    validDirections.push({
      x: x + 1,
      y,
      char: east,
      prevX: x,
      prevY: y,
      steps: 1,
    });
  }
  if (west === '-' || west === 'F' || west === 'L') {
    validDirections.push({
      x: x - 1,
      y,
      char: west,
      prevX: x,
      prevY: y,
      steps: 1,
    });
  }

  return validDirections;
};

const findLengthOfLoop = (input: string[]) => {
  const map = input.map((line) => line.split(''));

  const start = findStart(input);

  const queue: QueueItem[] = [
    { ...start, char: 'S', prevX: -1, prevY: -1, steps: 0 },
  ];

  // hashed set of visited nodes
  const visited = new Set<string>();

  while (queue.length) {
    const { x, y, char, prevX, prevY, steps } = queue.shift()!;

    // check if we have visited this node before
    const hash = `${x},${y}`;
    if (visited.has(hash)) {
      return steps;
    } else {
      visited.add(hash);
    }

    switch (char) {
      case '|':
        if (prevY === y - 1) {
          // push new queue item that is going south
          queue.push({
            x,
            y: y + 1,
            char: map[y + 1][x],
            prevX: x,
            prevY: y,
            steps: steps + 1,
          });
        } else if (prevY === y + 1) {
          // push new queue item that is going north
          queue.push({
            x,
            y: y - 1,
            char: map[y - 1][x],
            prevX: x,
            prevY: y,
            steps: steps + 1,
          });
        }
        break;
      case '-':
        if (prevX === x - 1) {
          // push new queue item that is going east
          queue.push({
            x: x + 1,
            y,
            char: map[y][x + 1],
            prevX: x,
            prevY: y,
            steps: steps + 1,
          });
        } else if (prevX === x + 1) {
          // push new queue item that is going west
          queue.push({
            x: x - 1,
            y,
            char: map[y][x - 1],
            prevX: x,
            prevY: y,
            steps: steps + 1,
          });
        }
        break;
      case 'F':
        if (prevY === y + 1) {
          // push new queue item that is going east
          queue.push({
            x: x + 1,
            y,
            char: map[y][x + 1],
            prevX: x,
            prevY: y,
            steps: steps + 1,
          });
        } else if (prevX === x + 1) {
          // push new queue item that is going south
          queue.push({
            x,
            y: y + 1,
            char: map[y + 1][x],
            prevX: x,
            prevY: y,
            steps: steps + 1,
          });
        }
        break;
      case '7':
        if (prevY === y + 1) {
          // push new queue item that is going west
          queue.push({
            x: x - 1,
            y,
            char: map[y][x - 1],
            prevX: x,
            prevY: y,
            steps: steps + 1,
          });
        } else if (prevX === x - 1) {
          // push new queue item that is going south
          queue.push({
            x,
            y: y + 1,
            char: map[y + 1][x],
            prevX: x,
            prevY: y,
            steps: steps + 1,
          });
        }
        break;
      case 'J':
        if (prevY === y - 1) {
          // push new queue item that is going west
          queue.push({
            x: x - 1,
            y,
            char: map[y][x - 1],
            prevX: x,
            prevY: y,
            steps: steps + 1,
          });
        }
        if (prevX === x - 1) {
          // push new queue item that is going north
          queue.push({
            x,
            y: y - 1,
            char: map[y - 1][x],
            prevX: x,
            prevY: y,
            steps: steps + 1,
          });
        }
        break;
      case 'L':
        if (prevY === y - 1) {
          // push new queue item that is going east
          queue.push({
            x: x + 1,
            y,
            char: map[y][x + 1],
            prevX: x,
            prevY: y,
            steps: steps + 1,
          });
        }
        if (prevX === x + 1) {
          // push new queue item that is going north
          queue.push({
            x,
            y: y - 1,
            char: map[y - 1][x],
            prevX: x,
            prevY: y,
            steps: steps + 1,
          });
        }
        break;
      case 'S':
        queue.push(
          ...findValidDirectionsOnStart(
            {
              x,
              y,
            },
            map,
          ),
        );
    }
  }

  return 0;
};

function part1(_input: string[]) {
  const steps = findLengthOfLoop(_input);
  return steps;
}

function part2(_input: string[]) {
  return 'part2';
}

solve({ part1, part2, parser: parseLines(), test1: 8 });
