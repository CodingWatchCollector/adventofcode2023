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

var arrayFromRange = (startAsStr, rangeAsStr) => {
  var startAsNum = parseInt(startAsStr);
  var rangeAsNum = parseInt(rangeAsStr);
  return Array.from({ length: rangeAsNum }).map((_, i) => i + startAsNum);
};

var seeds = input
  .match(/seeds: ([\d\s]+)$/m)[1]
  .trim()
  .split(/\s/)
  .reduce(
    (acc, currAsStr, index, arr) =>
      index & 1
        ? (acc.push(arrayFromRange(arr[index - 1], currAsStr, arr, index)), acc)
        : acc,
    []
  )
  .flat();

var getMapInputs = (input, mapName) => {
  var reg = new RegExp(`${mapName} map:\\s+(\\d[\\d\\s]+)`);
  return input
    .match(reg)[1]
    .trim()
    .split(/\n|\r/)
    .map((line) => {
      var arr = line.split(" ");
      return {
        dest: parseInt(arr[0]),
        source: parseInt(arr[1]),
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

var mapValues = (sourceArr, destArr) => {
  return sourceArr.map((src) => {
    var destValue = undefined;
    return destArr.some((dictionary) => {
      var srcDiff = src - dictionary.source;
      return srcDiff >= 0 && srcDiff < dictionary.range
        ? ((destValue = srcDiff + dictionary.dest), true)
        : false;
    })
      ? destValue
      : src;
  });
};

console.log(
  Math.min(
    ...[
      seedToSoil,
      soilToFertilizer,
      fertilizerToWater,
      waterToLight,
      lightToTemperature,
      temperatureToHumidity,
      humidityToLocation,
    ].reduce(mapValues, seeds)
  )
);
