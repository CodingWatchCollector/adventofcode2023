import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

var rl = createInterface({
  input: createReadStream("./calibration-input.txt"),
  crlfDelay: Infinity,
});

var acc = 0;
rl.on("line", (line) => {
  var firstNumReg = /(\d).*$/;
  var lastNumReg = /^.*(\d)/;
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
