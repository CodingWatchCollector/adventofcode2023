import { readFileSync } from "node:fs";

var input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;
var input = readFileSync("./input.txt", { encoding: "utf8" });

// var arrayFromRange = (startAsStr, rangeAsStr) => {
//   var startAsNum = parseInt(startAsStr);
//   var rangeAsNum = parseInt(rangeAsStr);
//   return Array.from({ length: rangeAsNum }).map((_, i) => i + startAsNum);
// };

var seedArr = input
  .match(/seeds: ([\d\s]+)$/m)[1]
  .trim()
  .split(/\s/)
  .reduce(
    (acc, rangeAsStr, index, arr) =>
      index & 1
        ? acc.concat([[parseInt(arr[index - 1]), parseInt(rangeAsStr)]])
        : acc,
    []
  );

var valueInSeedArr = (val, seedArr) =>
  seedArr.some((seed) => {
    var seedStart = seed[0];
    var seedRange = seed[1];
    return val >= seedStart && val <= seedStart + seedRange;
  });

var getMapInputs = (input, mapName) => {
  var reg = new RegExp(`${mapName} map:\\s+(\\d[\\d\\s]+)`);
  return input
    .match(reg)[1]
    .trim()
    .split(/\n|\r/)
    .map((line) => {
      var arr = line.split(" ");
      return {
        source: parseInt(arr[0]),
        dest: parseInt(arr[1]),
        range: parseInt(arr[2]),
      };
    });
};

var seedToSoil = getMapInputs(input, "seed-to-soil");
var soilToFertilizer = getMapInputs(input, "soil-to-fertilizer");
var fertilizerToWater = getMapInputs(input, "fertilizer-to-water");
var waterToLight = getMapInputs(input, "water-to-light");
var lightToTemperature = getMapInputs(input, "light-to-temperature");
var temperatureToHumidity = getMapInputs(input, "temperature-to-humidity");
var humidityToLocation = getMapInputs(input, "humidity-to-location");

var mapValue = (source, destArr) => {
  return (
    destArr.reduce((destValue, dictionary) => {
      if (destValue !== undefined) {
        return destValue;
      }
      var srcDiff = source - dictionary.source;
      return srcDiff >= 0 && srcDiff < dictionary.range
        ? srcDiff + dictionary.dest
        : undefined;
    }, undefined) ?? source
  );
};

var inversedChain = [
  seedToSoil,
  soilToFertilizer,
  fertilizerToWater,
  waterToLight,
  lightToTemperature,
  temperatureToHumidity,
  humidityToLocation,
].reverse();

for (var i = 0; i <= Number.MAX_SAFE_INTEGER; i++) {
  var seed = inversedChain.reduce(mapValue, i);
  if (valueInSeedArr(seed, seedArr)) {
    console.log(`found! seed: ${seed}, location: ${i}`);
    break;
  } else {
    // console.log("seed", seed);
  }
}

// console.log(
//   Math.min(
//     ...[
//       seedToSoil,
//       soilToFertilizer,
//       fertilizerToWater,
//       waterToLight,
//       lightToTemperature,
//       temperatureToHumidity,
//       humidityToLocation,
//     ].reduce(mapValues, seeds)
//   )
// );
