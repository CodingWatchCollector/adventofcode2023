import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

var rl = createInterface({
  input: createReadStream("./input.txt"),
  crlfDelay: Infinity,
});

var conditions = {
  red: 12,
  green: 13,
  blue: 14,
};

var isPossibleGame = (count, color) =>
  (color === "red" && count <= 12) ||
  (color === "green" && count <= 13) ||
  (color === "blue" && count <= 14)
    ? true
    : false;

var atLeastTwoDigitsCubesReg = /(\d{2,}) (\w+)/g;
var gameIdReg = /Game (\d+)/;

var acc = 0;

// var test =
//   "Game 8: 9 green, 1 red; 18 green, 2 red, 7 blue; 1 blue, 9 green, 3 red; 3 red, 15 blue, 18 green";
// var matches = Array.from(test.matchAll(atLeastTwoDigitsCubesReg));
// console.log(matches);

rl.on("line", (line) => {
  var gameIsPossible = Array.from(
    line.matchAll(atLeastTwoDigitsCubesReg)
  ).every((match) => isPossibleGame(match[1], match[2]));
  gameIsPossible ? (acc += parseInt(line.match(gameIdReg)[1])) : null;
});

rl.on("close", () => {
  console.log(acc);
});
