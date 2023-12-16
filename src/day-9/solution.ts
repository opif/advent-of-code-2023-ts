import * as fs from "node:fs";

const fileName = "input.test";
const lines = fs
    .readFileSync(fileName, { encoding: "utf-8", flag: "r" })
    .split("\n")
    .filter((line) => !!line.trim());

const oasisReport = lines.map((line) =>
    line.split(" ").map((number) => Number(number))
);

oasisReport.forEach(report => {
    const lastItem = report.at(-1);
    const r = report.reduce((acc, value) => , []);
})