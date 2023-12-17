import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

var rl = createInterface({
  input: createReadStream("./input.txt"),
  crlfDelay: Infinity,
});

var testInput = ["0 3 6 9 12 15", "1 3 6 10 15 21", "10 13 16 21 30 45"];

var getSequencesArray = (inputArr) => {
  var getDiffArray = (array) =>
    array.reduce(
      (acc, curr, i) =>
        i === 0 ? acc : acc.concat(parseInt(curr) - parseInt(array[i - 1])),
      []
    );
  var pushUntil = (accArray) => {
    var diffArray = getDiffArray(accArray.at(-1));
    var first = diffArray[0];
    return diffArray.every((n) => n === first)
      ? accArray.concat([diffArray])
      : pushUntil(accArray.concat([diffArray]));
  };
  return pushUntil([inputArr]);
};

var getPreviousNumber = (sequencesArr) =>
  [...sequencesArr].reverse().reduce((acc, currArr) => currArr[0] - acc, 0);

var res = 0;

rl.on("line", (line) => {
  // testInput.forEach((line) => {
  var splittedInput = line
    .trim()
    .split(/\s/)
    .map((str) => parseInt(str));
  var sequencesArr = getSequencesArray(splittedInput);
  // console.log(sequencesArr);
  // console.log(getPreviousNumber(sequencesArr));
  res += getPreviousNumber(sequencesArr);
});

rl.on("close", () => console.log(res));
// console.log(res);
