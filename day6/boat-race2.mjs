import { readFileSync } from "node:fs";

var input = readFileSync("./input.txt", { encoding: "utf-8" });

var time = parseInt(input.match(/time:([\d\s]+)$/im)[1].replace(/\s/g, ""));
var distance = parseInt(
  input.match(/distance:([\d\s]+)$/im)[1].replace(/\s+/g, "")
);

var res = 0;

for (var i = 1; i < time; i++) {
  var diff = time - i;
  if (diff < i) {
    throw new Error("not possible");
  }

  if (diff * i > distance) {
    res = diff - i + 1;
    break;
  }
}

console.log(res);
