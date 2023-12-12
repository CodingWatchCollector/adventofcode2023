import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

var rl = createInterface({
  input: createReadStream("./input.txt"),
  crlfDelay: Infinity,
});

var cubesReg = /(\d+) (\w+)/g;

var acc = 0;

rl.on("line", (line) => {
  var neededCubesObj = Array.from(line.matchAll(cubesReg)).reduce(
    (cubesObj, match) => {
      var color = match[2];
      var count = parseInt(match[1]);
      return cubesObj[color] < count
        ? ((cubesObj[color] = count), cubesObj)
        : cubesObj;
    },
    {
      red: 1,
      green: 1,
      blue: 1,
    }
  );
  acc += Object.values(neededCubesObj).reduce((res, cubes) => res * cubes, 1);
});

rl.on("close", () => {
  console.log(acc);
});
