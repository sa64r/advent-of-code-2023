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

// find loop
// find mid point of the loop from the start

const findStartCoordinates = (input: string[]) => {
  for (const line of input) {
    const index = line.indexOf('S');
    if (index !== -1) {
      return [index, input.indexOf(line)];
    }
  }
  throw new Error('No start found');
};

type HandlePipeInputs = {
  lastCoordinates: {
    x: number;
    y: number;
  };
  currentCoordinates: {
    x: number;
    y: number;
  };
};

const handleVerticalPipe = ({
  lastCoordinates,
  currentCoordinates,
}: HandlePipeInputs) => {
  // if above move down
  if (lastCoordinates.y < currentCoordinates.y) {
    currentCoordinates.y++;
  }
  // if below move up
  if (lastCoordinates.y > currentCoordinates.y) {
    currentCoordinates.y--;
  }

  return currentCoordinates;
};

const handleHorizontalPipe = ({
  lastCoordinates,
  currentCoordinates,
}: HandlePipeInputs) => {
  // if left move right
  if (lastCoordinates.x < currentCoordinates.x) {
    currentCoordinates.x++;
  }
  // if right move left
  if (lastCoordinates.x > currentCoordinates.x) {
    currentCoordinates.x--;
  }

  return currentCoordinates;
};

const handleFBend = ({
  lastCoordinates,
  currentCoordinates,
}: HandlePipeInputs) => {
  // if below move right
  if (lastCoordinates.y < currentCoordinates.y) {
    currentCoordinates.x++;
  }
  // if left move down
  if (lastCoordinates.x < currentCoordinates.x) {
    currentCoordinates.y++;
  }

  return currentCoordinates;
};

const handle7Bend = ({
  lastCoordinates,
  currentCoordinates,
}: HandlePipeInputs) => {
  // if below move left
  if (lastCoordinates.y < currentCoordinates.y) {
    currentCoordinates.x--;
  }
  // if right move down
  if (lastCoordinates.x > currentCoordinates.x) {
    currentCoordinates.y++;
  }

  return currentCoordinates;
};

const handleJBend = ({
  lastCoordinates,
  currentCoordinates,
}: HandlePipeInputs) => {
  // if above move left
  if (lastCoordinates.y > currentCoordinates.y) {
    currentCoordinates.x--;
  }
  // if right move up
  if (lastCoordinates.x > currentCoordinates.x) {
    currentCoordinates.y--;
  }

  return currentCoordinates;
};

const handleLBend = ({
  lastCoordinates,
  currentCoordinates,
}: HandlePipeInputs) => {
  // if above move right
  if (lastCoordinates.y > currentCoordinates.y) {
    currentCoordinates.x++;
  }
  // if left move up
  if (lastCoordinates.x < currentCoordinates.x) {
    currentCoordinates.y--;
  }

  return currentCoordinates;
};

const handleOnStart = ({ currentCoordinates, map }) => {
  // find direction you can legally move

  const above = map[currentCoordinates.y - 1][currentCoordinates.x];
  const below = map[currentCoordinates.y + 1][currentCoordinates.x];
  const left = map[currentCoordinates.y][currentCoordinates.x - 1];
  const right = map[currentCoordinates.y][currentCoordinates.x + 1];

  console.log(above, below, left, right);

  if (above === '|' || above === 'F' || above === '7') {
    return {
      currentCoordinates: {
        x: currentCoordinates.x,
        y: currentCoordinates.y - 1,
      },
    };
  } else if (below === '|' || below === 'J' || below === 'L') {
    return {
      currentCoordinates: {
        x: currentCoordinates.x,
        y: currentCoordinates.y + 1,
      },
    };
  } else if (left === '-' || left === '7' || left === 'J') {
    return {
      currentCoordinates: {
        x: currentCoordinates.x - 1,
        y: currentCoordinates.y,
      },
    };
  } else if (right === '-' || right === 'L' || right === 'F') {
    return {
      currentCoordinates: {
        x: currentCoordinates.x + 1,
        y: currentCoordinates.y,
      },
    };
  }

  throw new Error('No direction found');
};

const findDistanceOfLoop = (map: string[]) => {
  const start = findStartCoordinates(map);

  let currentCoordinates = {
    x: start[0],
    y: start[1],
  };
  let steps = 0;

  let lastCoordinates = {
    x: start[0],
    y: start[1],
  };

  while (
    steps === 0
      ? currentCoordinates.x === start[0] && currentCoordinates.y === start[1]
      : currentCoordinates.x !== start[0] && currentCoordinates.y !== start[1]
  ) {
    const currChar = map[currentCoordinates.y][currentCoordinates.x];
    const lastCoordinatesTemp = currentCoordinates;

    console.log({
      currentCoordinates,
      lastCoordinates,
      currChar,
    });

    switch (currChar) {
      case '|':
        currentCoordinates = handleVerticalPipe({
          lastCoordinates,
          currentCoordinates,
        });
        break;
      case '-':
        currentCoordinates = handleHorizontalPipe({
          lastCoordinates,
          currentCoordinates,
        });
        break;
      case 'F':
        currentCoordinates = handleFBend({
          lastCoordinates,
          currentCoordinates,
        });
        break;
      case '7':
        currentCoordinates = handle7Bend({
          lastCoordinates,
          currentCoordinates,
        });
        break;
      case 'J':
        currentCoordinates = handleJBend({
          lastCoordinates,
          currentCoordinates,
        });
        break;
      case 'L':
        currentCoordinates = handleLBend({
          lastCoordinates,
          currentCoordinates,
        });
        break;
      case 'S':
        const { currentCoordinates: newCurrentCoordinates } = handleOnStart({
          currentCoordinates,
          map,
        });
        currentCoordinates = newCurrentCoordinates;
    }

    console.log({
      currentCoordinates,
    });

    lastCoordinates = lastCoordinatesTemp;
    steps++;
  }

  return steps;
};

function part1(_input: string[]) {
  console.log(findDistanceOfLoop(_input));

  return 0;
}

function part2(_input: string[]) {
  return 'part2';
}

solve({ part1, part2, parser: parseLines(), test1: 8 });
