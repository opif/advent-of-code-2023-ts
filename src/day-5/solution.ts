import * as fs from "node:fs";

const convertRange = (value: number, ranges: Range[]): number => {
    for (const range of ranges) {
        if (value >= range.sourceStart && value <= range.sourceEnd) {
            value = range.destinationStart + (value - range.sourceStart);

            break;
        }
    }

    return value;
};

const convert = (value: number, rangesList: Range[][]): number => {
    for (const ranges of rangesList) {
        value = convertRange(value, ranges);
    }

    return value;
};

const chunkArray = <T>(input: T[], size: number): T[][] => {
    const chunked: T[][] = [];

    while (input.length > 0) {
        const temp = input.splice(0, size);

        chunked.push(temp);
    }

    return chunked;
};

const fileName = "input";
const lines = fs
    .readFileSync(fileName, { encoding: "utf-8", flag: "r" })
    .split("\n")
    .filter((line) => !!line.trim());

const seedLine = lines.shift();
const seeds =
    seedLine
        ?.split(":")[1]
        .split(" ")
        .filter((seed) => !!seed)
        .map((seed) => Number(seed)) ?? [];
const seedRanges: SeedRange[] = chunkArray(seeds, 2).map(([start, length]) => ({
    start,
    end: start + length - 1,
}));

let conversionMaps: Range[][] = [];
let tempMap: Range[] = [];

for (const line of lines) {
    if (!line.trim()) {
        continue;
    }

    if (line.includes("map:")) {
        if (tempMap.length > 0) {
            conversionMaps.push(tempMap);
            tempMap = [];
        }
        continue;
    }

    const [destinationStart, sourceStart, length] = line
        .split(" ")
        .map((num) => Number(num));

    const range: Range = {
        sourceStart,
        destinationStart,
        sourceEnd: sourceStart + length - 1,
    };

    tempMap.push(range);
}
conversionMaps.push(tempMap);

const locations = seeds.map((seed) => convert(seed, conversionMaps));
const [nearestLocation1] = locations.sort((a, b) => a - b);

let nearestLocation2 = Number.MAX_SAFE_INTEGER;
for (const seedRange of seedRanges) {
    for (let seed = seedRange.start; seed <= seedRange.end; seed++) {
        const location = convert(seed, conversionMaps);

        if (location < nearestLocation2) {
            nearestLocation2 = location;
        }
    }
}

console.log({ nearestLocation1, nearestLocation2 });

type Range = {
    sourceStart: number;
    sourceEnd: number;
    destinationStart: number;
};

type SeedRange = {
    start: number;
    end: number;
};
