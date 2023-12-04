import { sum } from 'lodash';
import { parseLines, solve } from '../utils/typescript';

const formatInput = (input: string[]) => {
  const extractData = input.map((line) => line.split(': ')[1]);

  const winningNumbersToPickedNumbers = extractData.map((line) => {
    const [winningNumbers, pickedNumbers] = line.split(' | ');
    return {
      winningNumbers: winningNumbers.split(' ').filter((n) => !!n),
      pickedNumbers: pickedNumbers.split(' ').filter((n) => !!n),
    };
  });

  return winningNumbersToPickedNumbers;
};

const countNumberOfWinningNumbers = (
  winningNumbers: string[],
  pickedNumbers: string[],
) => {
  return winningNumbers.filter((n) => pickedNumbers.includes(n)).length;
};

function part1(_input: string[]) {
  const input = formatInput(_input);

  // for each line in input count number of winning numbers that are in picked numbers
  const winingNumberCounts = input.map(({ winningNumbers, pickedNumbers }) =>
    countNumberOfWinningNumbers(winningNumbers, pickedNumbers),
  );

  const points = winingNumberCounts.map((count) => {
    if (count === 0) return 0;
    const points = 2 ** (count - 1);

    return points;
  });

  return sum(points);
}

function part2(_input: string[]) {
  const input = formatInput(_input);

  // for each line in input count number of winning numbers that are in picked numbers
  const winingNumberCounts = input.map(({ winningNumbers, pickedNumbers }) =>
    countNumberOfWinningNumbers(winningNumbers, pickedNumbers),
  );

  const numberOfCardsMap = new Map<number, number>();

  winingNumberCounts.forEach((count, index) => {
    const cardNumber = index + 1;

    // set one to current card number, if it is or not in the map
    !numberOfCardsMap.has(cardNumber)
      ? numberOfCardsMap.set(cardNumber, 1)
      : numberOfCardsMap.set(cardNumber, numberOfCardsMap.get(cardNumber) + 1);

    // if there are no winning numbers, skip
    if (count === 0) return;

    for (let j = 0; j < numberOfCardsMap.get(cardNumber); j++) {
      for (let i = 1; i <= count; i++) {
        const nextCardNumber = cardNumber + i;
        const currentCount = numberOfCardsMap.get(nextCardNumber);
        if (currentCount === undefined) {
          numberOfCardsMap.set(nextCardNumber, 1);
        } else {
          numberOfCardsMap.set(nextCardNumber, currentCount + 1);
        }
      }
    }
  });

  // sum all values in map
  const sumOfCards = sum([...numberOfCardsMap.values()]);

  return sumOfCards;
}

solve({ part1, part2, parser: parseLines(), test2: 30 });
