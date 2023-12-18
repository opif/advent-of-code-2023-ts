import * as fs from "node:fs";

const fileName = "input";
const lines = fs
    .readFileSync(fileName, { encoding: "utf-8", flag: "r" })
    .split("\n")
    .filter((line) => !!line.trim());

const findCritter = (lines: string[]) => {
    for (const [y, line] of lines.entries()) {
        const x = line.indexOf("S");

        if (x >= 0) {
            return [x, y];
        }
    }

    console.error("Critter not found");

    return [-1, -1];
};

type Pos = [number, number];

const move = ([x, y]: Pos, pipe: string) => {
    switch (pipe) {
        case "|":
        case "-":
        case "J":
        case "F":
        case "L":
        case "7":
        default:
            console.error("Problem detected", pipe);
    }
};

const traversePipes = ([x, y]: Pos, lines: string[]): number => {
    switch (
        true
        //
    ) {
    }

    return 0;
};

const position = findCritter(lines);
