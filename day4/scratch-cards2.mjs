import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

var rl = createInterface({
  input: createReadStream("./input.txt"),
  // input: createReadStream("./input-small.txt"),
  crlfDelay: Infinity,
});

var numsGroupsReg = /:\s(.+)\s\|\s(.+)$/;

var instances = [];
rl.on("line", (line) => {
  var card = parseInt(line.match(/Card\s+(\d+)\s*:/)[1]) - 1;
  var matchRes = line.match(numsGroupsReg);
  var winningNumsArr = matchRes[1].trim().split(/\s+/g);
  var inputsArr = matchRes[2].trim().split(/\s+/g);
  var lineRes = inputsArr.reduce(
    (acc, num) => (winningNumsArr.includes(num) ? ++acc : acc),
    0
  );
  var multiplier = (instances[card] ??= 1);
  // console.log(instances);

  for (var i = 1; i <= lineRes; i++) {
    var target = card + i;
    instances[target]
      ? (instances[target] += multiplier)
      : (instances[target] = multiplier + 1);
  }
  // console.log(instances);
});

rl.on("close", () => {
  // console.log(instances);
  console.log(instances.reduce((acc, n) => acc + n, 0));
});
