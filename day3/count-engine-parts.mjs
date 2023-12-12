import { readFileSync } from "node:fs";

var inputLinesArr = readFileSync("./input.txt", { encoding: "utf-8" }).split(
  "\n"
);

var symbolReg = /[^0-9\.]/g;
var numReg = /\d+/g;

var testStr = [
  "467..114..",
  "...*......",
  "..35..633.",
  "......#...",
  "617*......",
  ".....+.58.",
  "..592.....",
  "......755.",
  "...$.*....",
  ".664.598..",
];

var addResults = (regex, strToTest, resArr) => {
  regex.test(strToTest)
    ? (resArr.push(regex.lastIndex - 1), addResults(regex, strToTest, resArr))
    : null;
};

console.log(
  inputLinesArr.reduce((acc, line, index, arr) => {
    var symbolsArr = [];
    addResults(symbolReg, line, symbolsArr);
    // check same line
    [...line.matchAll(numReg)].forEach((m) => {
      symbolsArr.some((sym) => {
        return sym === m.index - 1 || sym === m.index + m[0].length;
      })
        ? (acc += parseInt(m[0]))
        : null;
    });
    // check adjacent lines
    var adjacentLinesArr = [];
    if (index > 0) {
      adjacentLinesArr.push(arr[index - 1]);
    }
    if (index < arr.length - 1) {
      adjacentLinesArr.push(arr[index + 1]);
    }
    adjacentLinesArr.forEach((adjLine) => {
      var matches = adjLine.matchAll(numReg);
      [...matches].forEach((match) => {
        var start = match.index - 1;
        var end = match.index + match[0].length;
        var adjacentToSymbol = symbolsArr.some(
          (sym) => sym >= start && sym <= end
        );
        adjacentToSymbol ? (acc += parseInt(match[0])) : null;
      });
    });
    return acc;
  }, 0)
);
