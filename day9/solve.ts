import { parseLines, solve } from '../utils/typescript';

const getSequences = (input: string[]) => {
  const sequences = input.map((line) => {
    return line
      .trim()
      .split(' ')
      .map((n) => parseInt(n, 10));
  });

  return sequences;
};

const findNextInSequence = (sequence: number[]) => {
  const diffs = sequence
    .map((n, i) => {
      if (i === 0) return undefined;
      return n - sequence[i - 1];
    })
    .filter((n) => n !== undefined);

  const lastDiff = diffs[diffs.length - 1];

  let nextNumber: number;

  if (diffs.every((n) => n === 0)) {
    nextNumber = lastDiff + sequence[sequence.length - 1];
  } else {
    nextNumber = findNextInSequence(diffs) + sequence[sequence.length - 1];
  }

  return nextNumber;
};

function part1(_input: string[]) {
  const sequences = getSequences(_input);

  const nextNumbers = sequences.map((sequence) => {
    return findNextInSequence(sequence);
  });

  const sumOfNextNumbers = nextNumbers.reduce((acc, n) => acc + n, 0);

  return sumOfNextNumbers;
}

function part2(_input: string[]) {
  const sequences = getSequences(_input);

  const previousNumbers = sequences.map((sequence) => {
    const reverseSequence = sequence.slice().reverse();
    return findNextInSequence(reverseSequence);
  });

  const sumOfPreviousNumbers = previousNumbers.reduce((acc, n) => acc + n, 0);

  return sumOfPreviousNumbers;
}

solve({ part1, part2, parser: parseLines(), test2: 2 });
