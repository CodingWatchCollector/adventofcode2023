import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

var nums = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
var numsRegex = Object.keys(nums).reduce((acc, key) => `${acc}|${key}`, "\\d");

var rl = createInterface({
  input: createReadStream("./calibration-input.txt"),
  crlfDelay: Infinity,
});

var acc = 0;
rl.on("line", (line) => {
  var firstNumReg = new RegExp(`(${numsRegex}).*$`);
  var lastNumReg = new RegExp(`^.*(${numsRegex})`);
  var firstMatch = line.match(firstNumReg)[1];
  var lastMatch = line.match(lastNumReg)[1];
  var replaceNumIfNeeded = (string) =>
    Number.isNaN(parseInt(string)) ? nums[string] : string;
  acc += parseInt(
    `${replaceNumIfNeeded(firstMatch)}${replaceNumIfNeeded(lastMatch)}`
  );
});

rl.on("close", () => {
  console.log(acc);
});
