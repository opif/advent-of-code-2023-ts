import * as fs from "node:fs";

const zip = <T>(a1: T[], a2: T[]): [T, T][] => {
    console.assert(a1.length === a2.length);

    return a1.map((e, i) => [e, a2[i]]);
};

type Race = [number, number];

const findSolution = ([time, distance]: Race) => {
    let solutionCount = 0;

    for (let t = 1; t < time; t++) {
        const d = t * (time - t);

        if (d > distance) {
            solutionCount++;
        }
    }

    return solutionCount;
};

const fileName = "input";
const lines = fs
    .readFileSync(fileName, { encoding: "utf-8", flag: "r" })
    .split("\n")
    .filter((line) => !!line.trim());

const [timeLine, distanceLine] = lines;
const timeArray = timeLine
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => !!item)
    .slice(1)
    .map((item) => Number(item));
const distanceArray = distanceLine
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => !!item)
    .slice(1)
    .map((item) => Number(item));

const races: Race[] = zip(timeArray, distanceArray);

const solution1 = races
    .map((race) => findSolution(race))
    .reduce((acc, solution) => acc * solution, 1);

const time = Number(
    timeArray
        .map((item) => item.toString())
        .reduce((acc, item) => acc + item, "")
);
const distance = Number(
    distanceArray
        .map((item) => item.toString())
        .reduce((acc, item) => acc + item, "")
);

console.log({ solution1, solution2: findSolution([time, distance]) });
