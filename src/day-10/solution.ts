import * as fs from 'node:fs';

const fileName = 'input';
const lines = fs
    .readFileSync(fileName, { encoding: 'utf-8', flag: 'r' })
    .split('\n')
    .filter((line) => !!line.trim());

type Pos = [number, number];
type Optional<T> = T | null;

const findCritter = (lines: string[]): Optional<Pos> => {
    for (const [y, line] of lines.entries()) {
        const x = line.indexOf('S');

        if (x >= 0) {
            return [x, y];
        }
    }

    console.error('Critter not found');

    return null;
};

const findPipeAroundCritter = ([x, y]: Pos, lines: string[]): Optional<Pos> => {
    for (let ix = -1; ix < 2; ix++) {
        for (let iy = -1; iy < 2; iy++) {
            if (ix !== 0 && iy !== 0) {
                continue;
            }

            let dir: Optional<Direction> = null;
            switch (ix * 10 + iy) {
                case -10:
                    dir = Direction.W;
                case 10:
                    dir = Direction.E;
                case -1:
                    dir = Direction.N;
                case 1:
                    dir = Direction.S;
            }

            const [tx, ty] = move([x + ix, y + iy], dir!, lines[y + iy][x + ix]);

            if (tx === x && ty === y) {
                // we're golden?
            }
        }
    }

    return null;
};

enum Direction {
    N,
    S,
    W,
    E,
}

const move = ([x, y]: Pos, from: Direction, pipe: string): Pos => {
    const { N, S, W, E } = Direction;

    switch (pipe) {
        case '|':
            if (![N, S].includes(from)) {
                throw Error(`Invalid pipe direction: ${from} ${pipe}`);
            }

            if (from === N) {
                return [x, y + 1];
            }

            return [x, y - 1];
        case '-':
            if (![W, E].includes(from)) {
                throw Error(`Invalid pipe direction: ${from} ${pipe}`);
            }

            if (from === W) {
                return [x + 1, y];
            }

            return [x - 1, y];
        case 'J':
            if (![N, W].includes(from)) {
                throw Error(`Invalid pipe direction: ${from} ${pipe}`);
            }

            if (from === N) {
                return [x - 1, y];
            }

            return [x, y - 1];
        case 'F':
            if (![E, S].includes(from)) {
                throw Error(`Invalid pipe direction: ${from} ${pipe}`);
            }

            if (from === E) {
                return [x, y + 1];
            }

            return [x + 1, y];
        case 'L':
            if (![N, E].includes(from)) {
                throw Error(`Invalid pipe direction: ${from} ${pipe}`);
            }

            if (from === N) {
                return [x + 1, y];
            }

            return [x, y - 1];
        case '7':
            if (![W, S].includes(from)) {
                throw Error(`Invalid pipe direction: ${from} ${pipe}`);
            }

            if (from === W) {
                return [x, y + 1];
            }

            return [x - 1, y];
        default:
            throw Error(`Invalid pipe character: ${pipe}`);
    }
};

const traversePipes = ([x, y]: Pos, from: Direction, lines: string[]): number => {
    while (true) {
        //
    }

    return 0;
};

const position = findCritter(lines);
