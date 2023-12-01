import { keys, values } from 'lodash';
import { parseLines, solve } from '../utils/typescript';

function part1(input: string[]) {
  let sum = 0;

  for (const line of input) {
    const arr = line.split('');
    const justNums = arr
      .filter((c) => !isNaN(parseInt(c, 10)))
      .map((c) => parseInt(c, 10));

    const firstNum = justNums[0];
    const lastNum = justNums[justNums.length - 1];

    sum = sum + firstNum * 10 + lastNum;
  }

  return sum;
}

function part2(_input: string[]) {
  let sum = 0;

  const numbers = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };

  for (const line of _input) {
    // regex for keys and values of wordToNum
    const regexStr = `(${keys(numbers).join('|')}|${values(numbers).join(
      '|',
    )})`;
    const startRegex = new RegExp(regexStr);
    const endRegex = new RegExp(`.*${regexStr}`);

    const startMatch = line.match(startRegex);
    const endMatch = line.match(endRegex);
    console.log(startMatch, endMatch);

    const startNumber = parseInt(numbers[startMatch[1]] ?? startMatch[1], 10);
    const endNumber = parseInt(numbers[endMatch[1]] ?? endMatch[1], 10);

    console.log(startNumber, endNumber);

    sum = sum + startNumber * 10 + endNumber;
  }

  return sum;
}

solve({ part1, part2, parser: parseLines() });
