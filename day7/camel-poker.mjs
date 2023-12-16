import { createInterface } from "node:readline";
import { createReadStream } from "node:fs";

var rl = createInterface({
  input: createReadStream("./input.txt"),
  crlfDelay: Infinity,
});

var cardsByPower = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
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

var stateMachine = {
  5: "five",
  4: "four",
  3: {
    2: "full",
    0: "three",
  },
  0: {
    2: {
      2: "two",
      0: "one",
    },
    0: "high",
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
  // min 3
  var m1 = sortedInput.replace(/(.)\1\1+/, "");
  var res1 = stateMachine[sortedInput.length - m1.length];
  if (res1.constructor === String) {
    // console.log(res1);
    return res1;
  }

  // find a pair
  var m2 = m1.replace(/(.)\1+/, "");
  var res2 = res1[m1.length - m2.length];
  if (res2.constructor === String) {
    // console.log(res2);
    return res2;
  }
  // find a pair
  var m3 = m2.replace(/(.)\1+/, "");
  var res3 = res2[m2.length - m3.length];
  // console.log(res3);
  return res3;
};

var first = true;
rl.on("line", (line) => {
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
