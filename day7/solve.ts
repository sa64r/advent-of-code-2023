import { parseLines, solve } from '../utils/typescript';

const cardToNumber = (card: string) => {
  switch (card) {
    case 'A':
      return 14;
    case 'K':
      return 13;
    case 'Q':
      return 12;
    case 'J':
      return 11;
    case 'T':
      return 10;
    default:
      return parseInt(card, 10);
  }
};

type Hand = {
  cardsAsNums: number[];
  cards: string[];
  bid: number;
};

const parseInput = (input: string[]): Hand[] => {
  const hands = input.map((line) => {
    const [cards, bid] = line.trim().split(' ');

    return {
      cards: cards.split(''),
      cardsAsNums: cards.split('').map(cardToNumber),
      bid: parseInt(bid, 10),
    };
  });
  return hands;
};

const isFiveOfAKind = (counts: CardCounts) => {
  const isFiveOfAKind =
    Object.values(counts).filter((count) => count === 5).length === 1;
  return isFiveOfAKind;
};

const isFourOfAKind = (counts: CardCounts) => {
  const isFourOfAKind =
    Object.values(counts).filter((count) => count === 4).length === 1;
  return isFourOfAKind;
};

const isFullHouse = (counts: CardCounts) => {
  const isFullHouse =
    Object.values(counts).filter((count) => count === 2).length === 1 &&
    Object.values(counts).filter((count) => count === 3).length === 1;
  return isFullHouse;
};

const isThreeOfAKind = (counts: CardCounts) => {
  const isThreeOfAKind =
    Object.values(counts).filter((count) => count === 3).length === 1;
  return isThreeOfAKind;
};

const isTwoPair = (counts: CardCounts) => {
  const isTwoPair =
    Object.values(counts).filter((count) => count === 2).length === 2;
  return isTwoPair;
};

const isPair = (counts: CardCounts) => {
  const isPair =
    Object.values(counts).filter((count) => count === 2).length === 1;
  return isPair;
};

type CardCounts = Record<string, number>;

const cardCounts = (hand: Hand): CardCounts => {
  const cardCounts = {};
  hand.cards.forEach((card) => {
    if (cardCounts[card]) {
      cardCounts[card] += 1;
    } else {
      cardCounts[card] = 1;
    }
  });
  return cardCounts;
};

const formatHandsByType = (hands: Hand[]) => {
  const handsByType = {
    highCard: [],
    pair: [],
    twoPair: [],
    threeOfAKind: [],
    fullHouse: [],
    fourOfAKind: [],
    fiveOfAKind: [],
  };

  hands.forEach((hand) => {
    const counts = cardCounts(hand);

    if (isFiveOfAKind(counts)) {
      handsByType.fiveOfAKind.push(hand);
    } else if (isFourOfAKind(counts)) {
      handsByType.fourOfAKind.push(hand);
    } else if (isFullHouse(counts)) {
      handsByType.fullHouse.push(hand);
    } else if (isThreeOfAKind(counts)) {
      handsByType.threeOfAKind.push(hand);
    } else if (isTwoPair(counts)) {
      handsByType.twoPair.push(hand);
    } else if (isPair(counts)) {
      handsByType.pair.push(hand);
    } else {
      handsByType.highCard.push(hand);
    }
  });

  return handsByType;
};

const orderHandsByCard = (hands: Hand[]) => {
  const orderedHands = hands.sort((a, b) => {
    const aNums = a.cardsAsNums;
    const bNums = b.cardsAsNums;

    for (let i = 0; i < aNums.length; i++) {
      if (aNums[i] < bNums[i]) return -1;
      if (aNums[i] > bNums[i]) return 1;
    }

    return 0;
  });

  return orderedHands;
};

const rankHands = (
  hands: Record<string, Hand[]>,
): { rank: number; bid: number }[] => {
  const ranks = [];
  const order = [
    'highCard',
    'pair',
    'twoPair',
    'threeOfAKind',
    'fullHouse',
    'fourOfAKind',
    'fiveOfAKind',
  ];

  let currRank = 1;

  order.forEach((type) => {
    const handsOfType = hands[type];

    if (handsOfType.length === 0) return;

    if (handsOfType.length === 1) {
      ranks.push({ rank: currRank, bid: handsOfType[0].bid });
      currRank += 1;
      return;
    } else {
      const orderedHands = orderHandsByCard(handsOfType);
      for (let i = 0; i < orderedHands.length; i++) {
        ranks.push({ rank: currRank + i, bid: orderedHands[i].bid });
      }
      currRank += orderedHands.length;
    }
  });
  return ranks;
};

function part1(_input: string[]) {
  const hands = parseInput(_input);

  const handsByType = formatHandsByType(hands);

  const rankedHands = rankHands(handsByType);

  console.dir(handsByType, { depth: null });

  const sumOfRankTimesBid = rankedHands.reduce(
    (acc, curr) => acc + curr.rank * curr.bid,
    0,
  );

  return sumOfRankTimesBid;
}

function part2(_input: string[]) {
  return 'part2';
}

solve({ part1, part2, parser: parseLines(), test1: 6440 });
