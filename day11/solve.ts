import { parseLines, solve } from '../utils/typescript';

const expandSpace = (space: string[]): string[] => {
  // get indexes for rows and columns that have no #

  const rowsWithNoGalaxies = space
    .map((row, index) => {
      if (row.indexOf('#') === -1) {
        return index;
      }
      return undefined;
    })
    .filter((row) => row !== undefined);

  const columnsWithNoGalaxies = [];
  const width = space[0].length;
  for (let i = 0; i < width; i++) {
    const column = space.map((row) => row[i]);
    if (column.indexOf('#') === -1) {
      columnsWithNoGalaxies.push(i);
    }
  }

  const newSpace = space.map((row) => row.split(''));
  rowsWithNoGalaxies.forEach((row) => {
    newSpace[row] = new Array(width).fill('.');
  });

  columnsWithNoGalaxies.forEach((column) => {
    newSpace.forEach((row) => {
      row[column] = '.';
    });
  });

  // format space to be a string[]
  const newSpaceString = newSpace.map((row) => row.join(''));

  return newSpaceString;
};

const makeIntoGridAndNumberGalaxies = (space: string[]) => {
  const grid = space.map((row) => row.split(''));
  let galaxyNumber = 1;

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '#') {
        grid[y][x] = galaxyNumber.toString();
        galaxyNumber++;
      }
    });
  });

  return { grid, galaxyNumber: galaxyNumber - 1 };
};

const findShortestPaths = (
  grid: string[][],
  x: number,
  y: number,
  galaxyNumber: number,
  numberOfGalaxies: number,
) => {
  const queue = [[x, y, 0]];
  const visited = new Set();
  const paths: { from: string; to: string; steps: number }[] = [];

  while (queue.length) {
    const [x, y, steps] = queue.shift();
    const key = `${x},${y}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (grid[y][x] !== '.' && grid[y][x] !== galaxyNumber.toString()) {
      paths.push({
        from: galaxyNumber.toString(),
        to: grid[y][x],
        steps,
      });
    }

    if (x + 1 < grid[y].length) {
      queue.push([x + 1, y, steps + 1]);
    }

    if (x - 1 >= 0) {
      queue.push([x - 1, y, steps + 1]);
    }

    if (y + 1 < grid.length) {
      queue.push([x, y + 1, steps + 1]);
    }

    if (y - 1 >= 0) {
      queue.push([x, y - 1, steps + 1]);
    }
  }

  return paths;
};

const shortestPathsBetweenGalaxies = (
  grid: string[][],
  totalGalaxies: number,
) => {
  const pathsFound = {};

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== '.') {
        const galaxyNumber = parseInt(cell, 10);
        console.log(galaxyNumber);
        const paths = findShortestPaths(
          grid,
          x,
          y,
          galaxyNumber,
          totalGalaxies,
        );

        paths.forEach((path) => {
          const key = [parseInt(path.from), parseInt(path.to)].sort().join('-');
          if (!pathsFound[key]) {
            pathsFound[key] = path.steps;
          }
        });
      }
    });
  });

  return pathsFound;
};

function part1(_input: string[]) {
  const expandedSpace = expandSpace(_input);
  const { grid, galaxyNumber: totalGalaxies } =
    makeIntoGridAndNumberGalaxies(expandedSpace);
  const paths = shortestPathsBetweenGalaxies(grid, totalGalaxies);

  const sumOfShortestPaths = Object.values(paths).reduce(
    (acc: number, steps: number) => acc + steps,
    0,
  );

  console.log(sumOfShortestPaths);

  return 0;
}

function part2(_input: string[]) {
  return 'part2';
}

solve({ part1, part2, parser: parseLines(), test1: 374 });
