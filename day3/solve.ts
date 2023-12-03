import { sum } from 'lodash';
import { parseLines, solve } from '../utils/typescript';

type numberData = {
  value: number;
  x1: number;
  y: number;
  x2: number;
};

type symbolData = {
  symbol: string;
  x: number;
  y: number;
};

const isNumber = (n: string) => !isNaN(parseInt(n));

const findNumbers = (input: string[]): numberData[] => {
  const numbers: numberData[] = [];

  for (let y = 0; y < input.length; y++) {
    let numStack = [];
    let x1 = 0;
    let x2 = 0;

    for (let x = 0; x < input[y].length; x++) {
      const currChar = input[y][x];

      if (isNumber(currChar)) {
        if (!numStack.length) {
          x1 = x;
          x2 = x;
        } else {
          x2 = x;
        }
        numStack.push(currChar);
      } else {
        if (numStack.length) {
          const value = parseInt(numStack.join(''));
          numbers.push({ value, x1, y, x2 });
          numStack = [];
        }
      }
    }

    if (numStack.length) {
      const value = parseInt(numStack.join(''));
      numbers.push({ value, x1, y, x2 });
      numStack = [];
    }
  }

  return numbers;
};

const isSymbol = (n: string) => n !== '.' && !isNumber(n);

const findSymbols = (input: string[]): symbolData[] => {
  const symbols: symbolData[] = [];

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const currChar = input[y][x];
      if (isSymbol(currChar)) {
        symbols.push({ symbol: currChar, x, y });
      }
    }
  }

  return symbols;
};

const isPartNumber = (
  n: numberData,
  symbols: symbolData[],
  xMax: number,
  yMax: number,
) => {
  // form an array of check coordinates that are around the number all the length of the number
  // ignore any coordinates that are outside the grid

  const checkCoords = [];

  // check the top and bottom of the number
  for (let x = n.x1 - 1; x <= n.x2 + 1; x++) {
    checkCoords.push({ x, y: n.y - 1 });
    checkCoords.push({ x, y: n.y + 1 });
  }

  // check the left and right of the number
  for (let y = n.y - 1; y <= n.y + 1; y++) {
    checkCoords.push({ x: n.x1 - 1, y });
    checkCoords.push({ x: n.x2 + 1, y });
  }

  // check the corners of the number
  checkCoords.push({ x: n.x1 - 1, y: n.y - 1 });
  checkCoords.push({ x: n.x2 + 1, y: n.y - 1 });
  checkCoords.push({ x: n.x1 - 1, y: n.y + 1 });
  checkCoords.push({ x: n.x2 + 1, y: n.y + 1 });

  const checkCoordsFiltered = checkCoords.filter(
    (c) => c.x >= 0 && c.x < xMax && c.y >= 0 && c.y < yMax,
  );

  const isSymbolAdjacent = checkCoordsFiltered.some((c) =>
    symbols.some((s) => s.x === c.x && s.y === c.y),
  );

  return isSymbolAdjacent;
};

const getPartNumbers = (
  numbers: numberData[],
  symbols: symbolData[],
  xMax: number,
  yMax: number,
) => {
  const partNumbers = numbers.filter((n) =>
    isPartNumber(n, symbols, xMax, yMax),
  );

  return partNumbers;
};

function part1(_input: string[]): number {
  const xMax = _input[0].length;
  const yMax = _input.length;

  const numbers = findNumbers(_input);
  const symbols = findSymbols(_input);
  const partNumbers = getPartNumbers(numbers, symbols, xMax, yMax);
  const partNumbersValues = partNumbers.map((n) => n.value);

  const answer = sum(partNumbersValues);

  return answer;
}

const getPartNumsAroundGear = (partNumbers: numberData[], gear: symbolData) => {
  const partNumsAroundGear = partNumbers.filter((n) => {
    const isPartNumAboveGear =
      n.y === gear.y - 1 && n.x1 <= gear.x && n.x2 >= gear.x;
    const isPartNumBelowGear =
      n.y === gear.y + 1 && n.x1 <= gear.x && n.x2 >= gear.x;
    const isPartNumLeftOfGear =
      n.x2 === gear.x - 1 && n.y <= gear.y && n.y >= gear.y;
    const isPartNumRightOfGear =
      n.x1 === gear.x + 1 && n.y <= gear.y && n.y >= gear.y;

    // check diagonals
    const isPartNumAboveLeftOfGear = n.x2 === gear.x - 1 && n.y === gear.y - 1;
    const isPartNumAboveRightOfGear = n.x1 === gear.x + 1 && n.y === gear.y - 1;
    const isPartNumBelowLeftOfGear = n.x2 === gear.x - 1 && n.y === gear.y + 1;
    const isPartNumBelowRightOfGear = n.x1 === gear.x + 1 && n.y === gear.y + 1;

    return (
      isPartNumAboveGear ||
      isPartNumBelowGear ||
      isPartNumLeftOfGear ||
      isPartNumRightOfGear ||
      isPartNumAboveLeftOfGear ||
      isPartNumAboveRightOfGear ||
      isPartNumBelowLeftOfGear ||
      isPartNumBelowRightOfGear
    );
  });

  return partNumsAroundGear;
};

const getPartNumsAroundGears = (
  partNumbers: numberData[],
  gears: symbolData[],
) => {
  const partNumsAroundGears = gears.map((g) => ({
    partNums: getPartNumsAroundGear(partNumbers, g),
    gear: g,
  }));

  return partNumsAroundGears;
};

function part2(_input: string[]) {
  const xMax = _input[0].length;
  const yMax = _input.length;

  const numbers = findNumbers(_input);
  const symbols = findSymbols(_input);
  const partNumbers = getPartNumbers(numbers, symbols, xMax, yMax);

  const gears = symbols.filter((s) => s.symbol === '*');

  const partNumsAroundGears = getPartNumsAroundGears(partNumbers, gears);

  const actualGears = partNumsAroundGears.filter((p) => p.partNums.length >= 2);

  const gearRatios = actualGears.map((g) => {
    const { partNums } = g;

    const gearRatio = partNums.reduce((acc, curr) => acc * curr.value, 1);

    return gearRatio;
  });

  const answer = sum(gearRatios);

  return answer;
}

solve({ part1, part2, parser: parseLines(), test2: 467835 });
