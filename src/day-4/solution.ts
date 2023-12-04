import * as fs from "node:fs";

const fileName = "input";
const lines = fs
  .readFileSync(fileName, { encoding: "utf-8", flag: "r" })
  .split("\n")
  .filter((line) => !!line.trim());

type Scratchcard = {
  cardNo: number;
  matchedCount: number;
  points: number;
  count: number;
};

const numbersFromTable = (table: string) =>
  table
    .split(" ")
    .map((number) => number.trim())
    .filter((number) => !!number)
    .map((number) => Number(number));

const scratchcards: Scratchcard[] = lines.map((line) => {
  const [card, numbers] = line.split(":");
  const cardNo = Number(card.split(" ")[1].trim());
  const [winning, selected] = numbers.split("|");

  const winningNo = numbersFromTable(winning);
  const selectedNo = numbersFromTable(selected);
  const winningSet = new Set(winningNo);
  const matchedCount = selectedNo.filter((number) =>
    winningSet.has(number)
  ).length;

  return {
    cardNo,
    count: 1,
    matchedCount,
    points: matchedCount > 0 ? Math.pow(2, matchedCount - 1) : 0,
  };
});

const points = scratchcards.reduce(
  (acc, scratchcard) => acc + scratchcard.points,
  0
);

let score = 0;
for (let i = 0; i < scratchcards.length; i++) {
  const scratchcard = scratchcards[i];
  score += scratchcard.count;

  for (let j = i + 1; j < i + scratchcard.matchedCount + 1; j++) {
    scratchcards[j].count += scratchcard.count;
  }
}

console.log(score);
console.log(points);
