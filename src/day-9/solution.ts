import * as fs from "node:fs";

const fileName = "input";
const lines = fs
    .readFileSync(fileName, { encoding: "utf-8", flag: "r" })
    .split("\n")
    .filter((line) => !!line.trim());

const oasisReport = lines.map((line) =>
    line.split(" ").map((number) => Number(number))
);

const isFinal = (report: number[]) => report.every((value) => value === 0);

const predictSeries = (report: number[]): [number, number] => {
    let firstItem = report.at(0)!;
    let lastItem = report.at(-1)!;
    const r = report.reduce<number[]>((acc, value) => {
        acc.push(value);
        if (acc.length > 1) {
            acc[acc.length - 2] = acc.at(-1)! - acc.at(-2)!;
        }

        return acc;
    }, []);
    r.pop();
    //   console.log({ firstItem, lastItem, r });

    if (!isFinal(r)) {
        const [predictedFirst, predictedLast] = predictSeries(r);
        firstItem -= predictedFirst;
        lastItem += predictedLast;
    }

    return [firstItem, lastItem];
};

const endValues = oasisReport.map(predictSeries);
const endValue = endValues.reduce(
    ([fa, la], [fv, lv]) => [fa + fv, la + lv],
    [0, 0]
);

console.log({ endValues, endValue });
