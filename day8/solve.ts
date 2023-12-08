import { parseLines, solve } from '../utils/typescript';

type Mapping = Record<string, string[]>;

const parseInput = (input: string[]): Mapping => {
  const mapping: Mapping = {};
  input.forEach((line) => {
    if (line.includes('=')) {
      const spaceLess = line.replace(/\s/g, '');
      const [key, value] = spaceLess.split('=');
      const destinations = value.slice(1, -1).split(',');
      mapping[key] = destinations;
    }
  });

  return mapping;
};

const hopsToDestination = (
  sequence: string[],
  mapping: Mapping,
  target: string,
  start: string,
): number => {
  let sequenceIndex = 0;
  let currPosition = start;
  let iterations = 0;
  const LIMIT = 1000000;

  while (currPosition !== target && iterations < LIMIT) {
    const direction = sequence[sequenceIndex];

    switch (direction) {
      case 'L':
        currPosition = mapping[currPosition][0];
        break;
      case 'R':
        currPosition = mapping[currPosition][1];
        break;
    }
    iterations++;

    if (sequenceIndex === sequence.length - 1) {
      sequenceIndex = 0;
    } else {
      sequenceIndex++;
    }
  }

  if (iterations === LIMIT) {
    return undefined;
  }

  return iterations;
};

const getSequence = (input: string[]): string[] => {
  const sequence = input[0].split('');
  return sequence;
};

function part1(_input: string[]) {
  const sequence = getSequence(_input);
  const mapping = parseInput(_input);

  return hopsToDestination(sequence, mapping, 'ZZZ', 'AAA');
}

const findStartingNodes = (mapping: Mapping): string[] => {
  const startingNodes: string[] = [];
  Object.keys(mapping).forEach((key) => {
    if (key.endsWith('A')) {
      startingNodes.push(key);
    }
  });

  return startingNodes;
};

const findEndingNodes = (mapping: Mapping): string[] => {
  const endingNodes: string[] = [];
  Object.keys(mapping).forEach((key) => {
    if (key.endsWith('Z')) {
      endingNodes.push(key);
    }
  });

  return endingNodes;
};

const gcd = (a: number, b: number): number => {
  if (b === 0) return a;
  return gcd(b, a % b);
};

function part2(_input: string[]) {
  const sequence = getSequence(_input);
  const mapping = parseInput(_input);
  const startingNodes = findStartingNodes(mapping);
  const endingNodes = findEndingNodes(mapping);

  const hopsToEnd = startingNodes.map((start) => {
    return endingNodes
      .map((end) => {
        return hopsToDestination(sequence, mapping, end, start);
      })
      .filter((hop) => hop !== undefined);
  });

  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  const hops = hopsToEnd.reduce((acc, curr) => {
    return lcm(acc, curr[0]);
  }, 1);

  return hops;
}

solve({ part1, part2, parser: parseLines(), test2: 6 });
