import { Puzzle } from '../../types/puzzle.ts';
import { identity, sumBy } from '../../utils/maths.ts';
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

const typeRanks = [
  HandType.FiveOfAKind,
  HandType.FourOfAKind,
  HandType.FullHouse,
  HandType.ThreeOfAKind,
  HandType.TwoPair,
  HandType.OnePair,
  HandType.HighCard,
] as const;

const cardRankMap = new Map(cardRanks.map((card, i) => [card, i]));
const rankCard = (card: CardType): number => cardRankMap.get(card) ?? 0;
const typeRankMap = new Map(typeRanks.map((hand, i) => [hand, i]));
const rankType = (type: HandType): number => typeRankMap.get(type) ?? 0;

const evaluateHandType = (counts: number[]): HandType => {
  const [first, second] = counts;
  if (first === 5) return HandType.FiveOfAKind;
  if (first === 4) return HandType.FourOfAKind;
  if (first === 3 && second === 2) return HandType.FullHouse;
  if (first === 3) return HandType.ThreeOfAKind;
  if (first === 2 && second === 2) return HandType.TwoPair;
  if (first === 2) return HandType.OnePair;
  return HandType.HighCard;
};

interface HandComparisonStrategy {
  evaluate(hand: CardHand): HandType;
  transform(hand: CardHand): CardHand;
}

const regularStrategy: HandComparisonStrategy = {
  evaluate(hand) {
    const countMap = new Map<CardType, number>();
    for (const card of hand) {
      countMap.set(card, (countMap.get(card) ?? 0) + 1);
    }

    const counts = Array.from(countMap.values()).sort((a, b) => b - a);
    return evaluateHandType(counts);
  },
  transform: identity,
};

const wildcardStrategy: HandComparisonStrategy = {
  evaluate(hand) {
    const countMap = new Map<CardType, number>();
    let wildcardCount = 0;

    for (const card of hand) {
      if (card === CardType.Joker) {
        ++wildcardCount;
      } else {
        countMap.set(card, (countMap.get(card) ?? 0) + 1);
      }
    }

    const counts = Array.from(countMap.values()).sort((a, b) => b - a);

    if (wildcardCount === 5) return HandType.FiveOfAKind;
    if (wildcardCount > 0 && counts.length > 0) counts[0] += wildcardCount;

    return evaluateHandType(counts);
  },
  transform: (hand) => hand.map((card) => (card === CardType.J ? CardType.Joker : card)) as CardHand,
};

const compareHands = (first: CardHand, second: CardHand, strategy: HandComparisonStrategy): number => {
  const firstType = strategy.evaluate(first);
  const secondType = strategy.evaluate(second);

  if (firstType !== secondType) {
    return rankType(firstType) - rankType(secondType);
  }

  for (let i = 0; i < first.length; ++i) {
    if (first[i] === second[i]) continue;
    return rankCard(first[i]) - rankCard(second[i]);
  }

  return 0;
};

interface HandBid {
  hand: CardHand;
  bid: number;
}

const solve = (bids: HandBid[], strategy: HandComparisonStrategy): number =>
  sumBy(
    bids.map(({ hand, bid }) => ({ hand: strategy.transform(hand), bid })).sort((a, b) =>
      compareHands(b.hand, a.hand, strategy)
    ),
    ({ bid }, index) => bid * (index + 1),
  );

export default Puzzle.new({
  prepare: (content): HandBid[] =>
    Str.lines(content).map((line) => {
      const [handStr, bidStr] = line.split(' ');

      return {
        hand: handStr.split('') as CardHand,
        bid: +bidStr,
      };
    }),
  easy: (bids) => solve(bids, regularStrategy),
  hard: (bids) => solve(bids, wildcardStrategy),
});
