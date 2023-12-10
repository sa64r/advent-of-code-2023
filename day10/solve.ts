import { writeFileSync } from 'fs';
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

  const north = y - 1 >= 0 ? map[y - 1][x] : undefined;
  const south = x + 1 < map[0].length ? map[y + 1][x] : undefined;
  const east = x + 1 < map[0].length ? map[y][x + 1] : undefined;
  const west = x - 1 >= 0 ? map[y][x - 1] : undefined;

  const northNorth = y - 2 >= 0 ? map[y - 2][x] : undefined;
  const southSouth = x + 2 < map[0].length ? map[y + 2][x] : undefined;
  const eastEast = x + 2 < map[0].length ? map[y][x + 2] : undefined;
  const westWest = x - 2 >= 0 ? map[y][x - 2] : undefined;

  const validDirections: QueueItem[] = [];

  // used for part 1
  // if (north === '|' || north === 'F' || north === '7') {
  //   validDirections.push({
  //     x,
  //     y: y - 1,
  //     char: north,
  //     prevX: x,
  //     prevY: y,
  //     steps: 1,
  //   });
  // }
  // if (south === '|' || south === 'L' || south === 'J') {
  //   validDirections.push({
  //     x,
  //     y: y + 1,
  //     char: south,
  //     prevX: x,
  //     prevY: y,
  //     steps: 1,
  //   });
  // }
  // if (east === '-' || east === '7' || east === 'J') {
  //   validDirections.push({
  //     x: x + 1,
  //     y,
  //     char: east,
  //     prevX: x,
  //     prevY: y,
  //     steps: 1,
  //   });
  // }
  // if (west === '-' || west === 'F' || west === 'L') {
  //   validDirections.push({
  //     x: x - 1,
  //     y,
  //     char: west,
  //     prevX: x,
  //     prevY: y,
  //     steps: 1,
  //   });
  // }

  if (north === '|') {
    if (northNorth === 'F' || northNorth === '7' || northNorth === '|') {
      validDirections.push({
        x,
        y: y - 1,
        char: north,
        prevX: x,
        prevY: y,
        steps: 1,
      });
    }
  }

  if (south === '|') {
    if (southSouth === 'L' || southSouth === '|' || southSouth === 'J') {
      validDirections.push({
        x,
        y: y + 1,
        char: south,
        prevX: x,
        prevY: y,
        steps: 1,
      });
    }
  }

  if (east === '-') {
    if (eastEast === '7' || eastEast === 'J' || eastEast === '-') {
      validDirections.push({
        x: x + 1,
        y,
        char: east,
        prevX: x,
        prevY: y,
        steps: 1,
      });
    }
  }

  if (west === '-') {
    if (westWest === 'F' || westWest === 'L' || westWest === '-') {
      validDirections.push({
        x: x - 1,
        y,
        char: west,
        prevX: x,
        prevY: y,
        steps: 1,
      });
    }
  }

  return validDirections;
};

const isCoordinateValid = (x: number, y: number, map: string[][]) => {
  return (
    x >= 0 && x < map[0].length && y >= 0 && y < map.length && map[y][x] !== ' '
  );
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
      return {
        steps,
        visited,
        map,
      };
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
          if (isCoordinateValid(x, y - 1, map)) {
            queue.push({
              x,
              y: y - 1,
              char: map[y - 1][x],
              prevX: x,
              prevY: y,
              steps: steps + 1,
            });
          }
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
        break;
      case '.':
        continue;
    }
  }

  return {
    steps: -1,
    visited: new Set<string>(),
    map,
  };
};

function part1(_input: string[]) {
  const { steps } = findLengthOfLoop(_input);
  return steps;
}

const increaseResolutionOfMap = (map: string[][]) => {
  const newMap = map.map((row, y) =>
    row.map((char, x) => {
      switch (char) {
        case 'L':
          return '.|.\n.L-\n...';
        case 'J':
          return '.|.\n-J.\n...';
        case 'F':
          return '...\n.F-\n.|.';
        case '7':
          return '...\n-7.\n.|.';
        case 'S':
          return '.|.\n-S-\n.|.';
        case '-':
          return '...\n---\n...';
        case '|':
          return '.|.\n.|.\n.|.';
        default:
          return '...\n...\n...';
      }
    }),
  );

  // make new map with increased resolution
  const increasedResolutionMap = newMap.map((row) => {
    const newRow = row.map((char) => char.split('\n'));
    const newRows = newRow.reduce((acc, val) => {
      return acc.map((row, i) => row.concat(val[i]));
    });
    return newRows;
  });

  return increasedResolutionMap.flat();
};

const simplifyMap = (map: string[][], loopNodes: string[]) => {
  const newMap = map.map((row, y) =>
    row.map((_, x) => (loopNodes.includes(`${x},${y}`) ? map[y][x] : '.')),
  );

  return newMap;
};

const floodFill = (grid: string[][]) => {
  const gridCopy: string[][] = grid.map((row) => [...row]);
  const pointsToExplore: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  while (pointsToExplore.length) {
    const point = pointsToExplore.shift();
    if (point) {
      const { x, y } = point;
      if (x < 0 || y < 0 || x >= gridCopy[0].length || y >= gridCopy.length) {
        continue;
      }
      if (gridCopy[y][x] === '.') {
        gridCopy[y][x] = 'O';
        pointsToExplore.push({ x: x - 1, y });
        pointsToExplore.push({ x: x + 1, y });
        pointsToExplore.push({ x, y: y - 1 });
        pointsToExplore.push({ x, y: y + 1 });
      }
    }
  }
  return gridCopy;
};

function part2(_input: string[]) {
  const oldMap = _input.map((line) => line.split(''));
  const increasedResolutionMap = increaseResolutionOfMap(oldMap);

  const { visited, map } = findLengthOfLoop(increasedResolutionMap);

  const simplifiedMap = simplifyMap(map, [...visited]);

  const floodedMap = floodFill(simplifiedMap);

  const unfilledCountTripRes = floodedMap.reduce(
    (acc, curr, y) =>
      acc +
      curr.reduce(
        (acc, rowCurr, x) =>
          rowCurr === '.' && y % 3 === 1 && x % 3 === 1 ? acc + 1 : acc,
        0,
      ),
    0,
  );

  return unfilledCountTripRes;
}

solve({ part1, part2, parser: parseLines(), test2: 10 });
