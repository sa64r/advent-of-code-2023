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
  return 'part2';
}

solve({ part1, part2, parser: parseLines() });
