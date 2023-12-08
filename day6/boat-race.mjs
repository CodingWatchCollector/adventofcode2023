import { readFileSync } from "node:fs";

var input = readFileSync("./input.txt", { encoding: "utf-8" });

var timeArr = input
  .match(/time:([\d\s]+)$/im)[1]
  .trim()
  .split(/\s+/);
var distanceArr = input
  .match(/distance:([\d\s]+)$/im)[1]
  .trim()
  .split(/\s+/);
if (distanceArr.length !== timeArr.length) {
  throw new Error("arrays does not match");
}

var res = timeArr.reduce((acc, timeAsStr, index) => {
  var waysToWin = 0;
  var distance = parseInt(distanceArr[index]);
  var time = parseInt(timeAsStr);
  for (var i = 1; i < time; i++) {
    (time - i) * i > distance && waysToWin++;
  }
  return waysToWin !== 0 ? acc * waysToWin : acc;
}, 1);

console.log(res);
