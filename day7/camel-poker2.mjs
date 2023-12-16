import { createInterface } from "node:readline";
import { createReadStream } from "node:fs";

var rl = createInterface({
  input: createReadStream("./input.txt"),
  crlfDelay: Infinity,
});

var cardsByPower = [
  "J",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
];
var test = ["32T3K 765", "T55J5 684", "KK677 28", "KTJJT 220", "QQQJA 483"];

var sortByHandValue = (first, second) => {
  var a = first.hand;
  var b = second.hand;
  return a.split("").reduce((res, valA, i) => {
    var valB;
    return res !== 0
      ? res
      : ((valB = b[i]), valA === valB)
      ? 0
      : cardsByPower.findIndex((v) => v === valA) >
        cardsByPower.findIndex((v) => v === valB)
      ? 1
      : -1;
  }, 0);
};

var jokerRegex = /J+/;
var minPairRegex = /(.)\1+/;
var minThreeReg = /(.)\1\1+/;

var stateMachine = {
  // test jokers first
  pattern: jokerRegex,
  5: "five",
  4: "five",
  3: {
    pattern: minPairRegex,
    2: "five",
    0: "four",
  },
  2: {
    pattern: minPairRegex,
    3: "five",
    2: "four",
    0: "three",
  },
  1: {
    pattern: minPairRegex,
    4: "five",
    3: "four",
    2: {
      pattern: minPairRegex,
      2: "full",
      0: "three",
    },
    0: "one",
  },
  // no jokers case
  0: {
    pattern: minThreeReg,
    5: "five",
    4: "four",
    3: {
      pattern: minPairRegex,
      2: "full",
      0: "three",
    },
    0: {
      pattern: minPairRegex,
      2: {
        pattern: minPairRegex,
        2: "two",
        0: "one",
      },
      0: "high",
    },
  },
};

var handsByCombination = {
  five: [],
  four: [],
  full: [],
  three: [],
  two: [],
  one: [],
  high: [],
};

var getCombination = (str) => {
  var sortedInput = str.split("").sort().join("");

  var getRes = (input, stateMachine) => {
    var match = input.replace(stateMachine.pattern, "");
    var res = stateMachine[input.length - match.length];

    return res.constructor === String ? res : getRes(match, res);
  };

  return getRes(sortedInput, stateMachine);
};

rl.on("line", (line) => {
  // test.forEach((line) => {
  var { 0: hand, 1: bid } = line.trim().split(/\s+/);
  var comb = getCombination(hand);
  handsByCombination[comb] = handsByCombination[comb].concat([
    {
      hand,
      bid: parseInt(bid),
    },
  ]);
});

rl.on("close", () => {
  console.log(
    ["high", "one", "two", "three", "full", "four", "five"].reduce(
      (res, key) => {
        return handsByCombination[key]
          .sort(sortByHandValue)
          .reduce((acc, val) => {
            acc.rank++;
            acc.total += acc.rank * val.bid;
            return acc;
          }, res);
      },
      { total: 0, rank: 0 }
    )
  );
});
