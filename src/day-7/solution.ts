import * as fs from "node:fs";

type Hand = string;

enum HandType {
    HIGH_CARD = 0,
    ONE_PAIR = 1,
    TWO_PAIR = 2,
    THREE_OF_KIND = 3,
    FULL_HOUSE = 4,
    FOUR_OF_KIND = 5,
    FIVE_OF_KIND = 6,
}

enum CardType {
    A = "A",
    K = "K",
    Q = "Q",
    J = "J",
    T = "T",
    _9 = "9",
    _8 = "8",
    _7 = "7",
    _6 = "6",
    _5 = "5",
    _4 = "4",
    _3 = "3",
    _2 = "2",
}

const CardValues: Record<CardType, number> = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
};

const CardValues_p2: Record<CardType, number> = {
    A: 14,
    K: 13,
    Q: 12,
    T: 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
    J: 1,
};

const zip = <T>(a1: T[], a2: T[]): [T, T][] => {
    console.assert(a1.length === a2.length);

    return a1.map((e, i) => [e, a2[i]]);
};

const handType = (hand: Hand): HandType => {
    const cards = new Map<Hand, number>();

    for (const card of hand) {
        const count = cards.get(card) ?? 0;

        cards.set(card, count + 1);
    }

    const cardCount = [...cards].reduce((acc, [card, count]) => acc + count, 0);
    console.log({ cards, size: cards.size, cardCount });

    switch (cards.size) {
        case 1: {
            switch (cardCount) {
                case 5:
                    return HandType.FIVE_OF_KIND;
                case 4:
                    return HandType.FOUR_OF_KIND;
                case 3:
                    return HandType.THREE_OF_KIND;
                case 2:
                    return HandType.ONE_PAIR;
                case 1:
                    return HandType.HIGH_CARD;
            }
        }
        case 2: {
            const [[card, count]] = [...cards];

            if (cardCount === 5) {
                if (count === 4 || count === 1) {
                    return HandType.FOUR_OF_KIND;
                }

                return HandType.FULL_HOUSE;
            } else if (cardCount === 4) {
                if (count === 3 || count === 1) {
                    return HandType.THREE_OF_KIND;
                }

                return HandType.TWO_PAIR;
            } else if (cardCount === 3) {
                return HandType.ONE_PAIR;
            }

            return HandType.HIGH_CARD;
        }
        case 3: {
            if (cardCount === 5) {
                for (const [card, count] of cards) {
                    if (count === 3) {
                        return HandType.THREE_OF_KIND;
                    }
                }

                return HandType.TWO_PAIR;
            } else if (cardCount === 4) {
                return HandType.ONE_PAIR;
            }

            return HandType.HIGH_CARD;
        }
        case 4: {
            if (cardCount === 5) {
                return HandType.ONE_PAIR;
            }

            return HandType.HIGH_CARD;
        }
        default:
            return HandType.HIGH_CARD;
    }
};

const handType_upgrade = (type: HandType): HandType => {
    switch (type) {
        case HandType.HIGH_CARD:
            return HandType.ONE_PAIR;
        case HandType.ONE_PAIR:
            return HandType.THREE_OF_KIND;
        case HandType.TWO_PAIR:
            return HandType.FULL_HOUSE;
        case HandType.THREE_OF_KIND:
            return HandType.FOUR_OF_KIND;
        case HandType.FULL_HOUSE:
            return HandType.FIVE_OF_KIND;
        case HandType.FOUR_OF_KIND:
            return HandType.FIVE_OF_KIND;
        case HandType.FIVE_OF_KIND:
            return HandType.FIVE_OF_KIND;
    }
};

declare global {
    interface String {
        replaceAll(a1: string, a2: string): string;
    }
}

const handType_p2 = (hand: Hand): HandType => {
    if (!hand.replaceAll) return HandType.HIGH_CARD;

    const jokerlessHand = hand.replaceAll("J", "");
    let jokerlessHandType = handType(jokerlessHand);
    const jokerCount = [...hand].filter((card) => card === "J").length;

    console.log({
        jokerCount,
        jokerlessHand,
        type: jokerlessHandType,
    });

    for (let i = 0; i < jokerCount; i++) {
        jokerlessHandType = handType_upgrade(jokerlessHandType);

        // console.log(jokerlessHandType);
    }

    return jokerlessHandType;
};

const IsCardType = (s: string): s is CardType => {
    if (s.length !== 1) return false;

    return true;
};

const cardCompare = (h1: Hand, h2: Hand, cvalue = CardValues): number => {
    const cardPairs = zip([...h1], [...h2]);

    for (const [l, r] of cardPairs) {
        if (!IsCardType(l) || !IsCardType(r)) {
            continue;
        }

        if (cvalue[l] > cvalue[r]) {
            return 1;
        } else if (cvalue[l] < cvalue[r]) {
            return -1;
        }
    }

    return 0;
};

const handCompare = (h1: Hand, h2: Hand): number => {
    const h1Type = handType(h1);
    const h2Type = handType(h2);

    if (h1Type > h2Type) {
        return 1;
    } else if (h1Type < h2Type) {
        return -1;
    }

    return cardCompare(h1, h2);
};

const handCompare_p2 = (h1: Hand, h2: Hand): number => {
    const h1Type = handType_p2(h1);
    const h2Type = handType_p2(h2);

    if (h1Type > h2Type) {
        return 1;
    } else if (h1Type < h2Type) {
        return -1;
    }

    return cardCompare(h1, h2, CardValues_p2);
};

const getHandTypeDescription = (hand: Hand): string => {
    const handType = handType_p2(hand);

    switch (handType) {
        case HandType.HIGH_CARD:
            return "HIGH_CARD";
        case HandType.ONE_PAIR:
            return "ONE_PAIR";
        case HandType.TWO_PAIR:
            return "TWO_PAIR";
        case HandType.THREE_OF_KIND:
            return "THREE_OF_KIND";
        case HandType.FULL_HOUSE:
            return "FULL_HOUSE";
        case HandType.FOUR_OF_KIND:
            return "FOUR_OF_KIND";
        case HandType.FIVE_OF_KIND:
            return "FIVE_OF_KIND";
        default:
            return "SHOULD NOT REACH";
    }
};

const fileName = "input";
const lines = fs
    .readFileSync(fileName, { encoding: "utf-8", flag: "r" })
    .split("\n")
    .filter((line) => !!line.trim());

const hands = lines
    .map((line) => line.split(" "))
    .map(([hand, bid]) => ({
        hand,
        bid: Number(bid),
        type: getHandTypeDescription(hand),
    }));

const hands_p1 = hands.sort(({ hand: h1 }, { hand: h2 }) =>
    handCompare(h1, h2)
);
const payout_p1 = hands_p1
    .map((hand, i) => hand.bid * (i + 1))
    .reduce((sum, value) => sum + value, 0);

const hands_p2 = hands.sort(({ hand: h1 }, { hand: h2 }) =>
    handCompare_p2(h1, h2)
);
const payout_p2 = hands_p2
    .map((hand, i) => hand.bid * (i + 1))
    .reduce((sum, value) => sum + value, 0);

for (let hand of hands_p2) {
    console.log(hand);
}

console.log({ payout_p1, payout_p2 });
