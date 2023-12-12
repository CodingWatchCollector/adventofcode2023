import { readFileSync } from "node:fs";

var inputLinesArr = readFileSync("./input.txt", { encoding: "utf-8" }).split(
  "\n"
);

var symbolReg = /\*/g;
var numReg = /\d+/g;

var testArr = [
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
    if (symbolsArr.length === 0) {
      return acc;
    }

    var adjacentLinesArr = [line];
    if (index > 0) {
      adjacentLinesArr.push(arr[index - 1]);
    }
    if (index < arr.length - 1) {
      adjacentLinesArr.push(arr[index + 1]);
    }

    var lineRes = symbolsArr.reduce((lineAcc, symbol) => {
      var gearsArr = adjacentLinesArr.reduce((gearsAcc, adjLine) => {
        var matches = adjLine.matchAll(numReg);
        [...matches].forEach((match) => {
          var start = match.index - 1;
          var end = match.index + match[0].length;
          var adjacentToSymbol = symbol >= start && symbol <= end;
          adjacentToSymbol ? gearsAcc.push(parseInt(match[0])) : null;
        });
        return gearsAcc;
      }, []);
      return gearsArr.length === 2
        ? lineAcc + gearsArr[0] * gearsArr[1]
        : lineAcc;
    }, 0);
    return acc + lineRes;
  }, 0)
);
