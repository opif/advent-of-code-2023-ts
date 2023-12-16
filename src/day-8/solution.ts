import * as fs from "node:fs";

type Instruction = {
    left: string;
    right: string;
};

const fileName = "input";
const lines = fs
    .readFileSync(fileName, { encoding: "utf-8", flag: "r" })
    .split("\n")
    .filter((line) => !!line.trim());

const instructionLine = lines.shift() ?? "";
const parser = /(\w\w\w) = \((\w\w\w), (\w\w\w)\)/;

const moveList = lines
    .map((line) => {
        const match = line.match(parser) ?? [];

        return { id: match[1], left: match[2], right: match[3] };
    })
    .reduce((acc, { id, ...move }) => {
        acc.set(id, move);

        return acc;
    }, new Map<string, Instruction>());

const traverseP1 = () => {
    let lastMove = "AAA";
    let moveCount = 0;

    while (true) {
        for (const instruction of [...instructionLine]) {
            const move = moveList.get(lastMove)!;

            if (instruction === "L") {
                lastMove = move.left;
            } else {
                lastMove = move.right;
            }

            moveCount++;

            if (lastMove === "ZZZ") {
                return moveCount;
            }
        }
    }
};

const traverseP2 = () => {
    const lastMoves = [...moveList]
        .map(([id]) => id)
        .filter((id) => id[2] === "A")
        .map((id) => ({ id, moveCount: 0 }));

    for (let lastMove of lastMoves) {
        outer: while (true) {
            for (const instruction of [...instructionLine]) {
                const move = moveList.get(lastMove.id)!;

                if (instruction === "L") {
                    lastMove.id = move.left;
                } else {
                    lastMove.id = move.right;
                }
                lastMove.moveCount++;

                if (lastMove.id[2] === "Z") {
                    break outer;
                }
            }
        }
    }

    let least = 1;
    for (let lastMove of lastMoves) {
        least = lcm(least, lastMove.moveCount);
    }
    return least;
};

const gcd = (a: number, b: number): number => {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }

    return a;
};

const lcm = (a: number, b: number): number => {
    return a * (b / gcd(a, b));
};

console.log({ p2: traverseP2() });
