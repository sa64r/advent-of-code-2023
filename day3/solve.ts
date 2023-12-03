import { parseLines, solve } from '../utils/typescript';

// is a string a number
const isNumber = (input: string | number) => {
  return !isNaN(Number(input.toString()));
};

const isSymbol = (input: string) => input !== '.' && !isNumber(input);

const checkIfSymbolNearby = (
  input: string[],
  i: number,
  j: number,
  width: number,
  height: number,
) => {
  const left = j - 1 >= 0 ? input[i][j - 1] : null;
  const right = j + 1 < width ? input[i][j + 1] : null;
  const up = i - 1 >= 0 ? input[i - 1][j] : null;
  const down = i + 1 < height ? input[i + 1][j] : null;
  const upLeft = i - 1 >= 0 && j - 1 >= 0 ? input[i - 1][j - 1] : null;
  const upRight = i - 1 >= 0 && j + 1 < width ? input[i - 1][j + 1] : null;
  const downLeft = i + 1 < height && j - 1 >= 0 ? input[i + 1][j - 1] : null;
  const downRight =
    i + 1 < height && j + 1 < width ? input[i + 1][j + 1] : null;

  const checks = [
    left,
    right,
    up,
    down,
    upLeft,
    upRight,
    downLeft,
    downRight,
  ].filter((direction) => direction !== null);

  return checks.some(isSymbol);
};

function part1(_input: string[]) {
  const width = _input[0].length;
  const height = _input.length;

  let sum = 0;

  for (let i = 0; i < height; i++) {
    let currNumberStack = [];
    let symbolNear = false;

    const row = _input[i];

    for (let j = 0; j < width; j++) {
      const currChar = row[j];

      if (!isNumber(currChar)) {
        // if we tracked a symbol nearby and we have a numbers in the stacks
        if (symbolNear && currNumberStack.length > 0) {
          const currNum = parseInt(currNumberStack.join(''));
          sum = sum + currNum;
        }
        symbolNear = false;
        currNumberStack = [];
      } else {
        currNumberStack.push(currChar);
      }

      if (!symbolNear && currNumberStack.length > 0)
        symbolNear = checkIfSymbolNearby(_input, i, j, width, height);
    }
  }

  return sum;
}

function part2(_input: string[]) {
  return 'part2';
}

solve({ part1, part2, parser: parseLines(), test1: 4361 });
