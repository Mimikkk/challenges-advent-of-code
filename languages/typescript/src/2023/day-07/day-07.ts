import { Puzzle } from '../../types/puzzle.ts';
import { Str } from '../../utils/strs.ts';

const enum CardType {
  A = 'A',
  K = 'K',
  Q = 'Q',
  J = 'J',
  T = 'T',
  Nine = '9',
  Eight = '8',
  Seven = '7',
  Six = '6',
  Five = '5',
  Four = '4',
  Three = '3',
  Two = '2',
  Joker = 'Joker',
}

const cardRanks = [
  CardType.A,
  CardType.K,
  CardType.Q,
  CardType.J,
  CardType.T,
  CardType.Nine,
  CardType.Eight,
  CardType.Seven,
  CardType.Six,
  CardType.Five,
  CardType.Four,
  CardType.Three,
  CardType.Two,
  CardType.Joker,
] as const;

type CardHand = [CardType, CardType, CardType, CardType, CardType];

const enum HandType {
  FiveOfAKind = 'five-of-a-kind',
  FourOfAKind = 'four-of-a-kind',
  FullHouse = 'full-house',
  ThreeOfAKind = 'three-of-a-kind',
  TwoPair = 'two-pair',
  OnePair = 'one-pair',
  HighCard = 'high-card',
}

const handRanks = [
  HandType.FiveOfAKind,
  HandType.FourOfAKind,
  HandType.FullHouse,
  HandType.ThreeOfAKind,
  HandType.TwoPair,
  HandType.OnePair,
  HandType.HighCard,
] as const;

const evaluateHandType = (hand: CardHand, useJokers = false): HandType => {
  const countMap = new Map<CardType, number>();
  let wildcardCount = 0;

  for (const card of hand) {
    if (useJokers && card === CardType.Joker) {
      ++wildcardCount;
    } else {
      countMap.set(card, (countMap.get(card) ?? 0) + 1);
    }
  }

  const counts = Array.from(countMap.values()).sort((a, b) => b - a);
  if (wildcardCount === 5) return HandType.FiveOfAKind;
  if (wildcardCount > 0 && counts.length > 0) counts[0] += wildcardCount;

  if (counts[0] === 5) return HandType.FiveOfAKind;
  if (counts[0] === 4) return HandType.FourOfAKind;
  if (counts[0] === 3 && counts[1] === 2) return HandType.FullHouse;
  if (counts[0] === 3) return HandType.ThreeOfAKind;
  if (counts[0] === 2 && counts[1] === 2) return HandType.TwoPair;
  if (counts[0] === 2) return HandType.OnePair;

  return HandType.HighCard;
};

const compareHands = (first: CardHand, second: CardHand, useJokers = false): number => {
  const firstType = evaluateHandType(first, useJokers);
  const secondType = evaluateHandType(second, useJokers);

  if (firstType !== secondType) {
    return handRanks.indexOf(firstType) - handRanks.indexOf(secondType);
  }

  for (let i = 0; i < first.length; ++i) {
    if (first[i] === second[i]) continue;
    return cardRanks.indexOf(first[i]) - cardRanks.indexOf(second[i]);
  }

  return 0;
};

interface HandBid {
  hand: CardHand;
  bid: number;
}

const parseHandBids = (content: string): HandBid[] =>
  Str.lines(content).map((line) => {
    const [handStr, bidStr] = line.split(' ');

    return {
      hand: handStr.split('') as CardHand,
      bid: +bidStr,
    };
  });

const scoreBids = (bids: HandBid[]): number => {
  let result = 0;
  for (let i = 0; i < bids.length; ++i) {
    const { bid } = bids[i];
    result += bid * (i + 1);
  }
  return result;
};

export default Puzzle.new({
  prepare: parseHandBids,
  easy(bids) {
    bids.sort((a, b) => compareHands(b.hand, a.hand));

    return scoreBids(bids);
  },
  hard(bids) {
    const jokerBids = bids.map(({ hand, bid }) => ({
      hand: hand.map((card) => card === CardType.J ? CardType.Joker : card) as CardHand,
      bid,
    }));

    jokerBids.sort((a, b) => compareHands(b.hand, a.hand, true));

    return scoreBids(jokerBids);
  },
});
