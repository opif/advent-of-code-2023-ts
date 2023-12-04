const fs = require("fs");

const fileName = "input";
const lines = fs
  .readFileSync(fileName, { encoding: "utf-8", flag: "r" })
  .split("\n")
  .filter((line) => !!line.trim());

const partNumbers = new Map();
let gearRatioSum = 0;
const isSymbol = (char) => !/^[\.\d]$/.test(char);
const isDigit = (char) => /^\d$/.test(char);
const getPartNumber = (line, position) => {
  while (position > 0 && isDigit(line[--position])) {}
  if (!isDigit(line[position])) {
    position++;
  }

  return Number(line.slice(position).match(/^(\d+)/)[1]);
};

lines.forEach((line, lineNo) => {
  [...line].forEach((c, charNo) => {
    if (isSymbol(c)) {
      const parts = new Set();
      console.log(c, lineNo, charNo);

      for (
        i = Math.max(lineNo - 1, 0);
        i <= lines.length - 1 && i <= lineNo + 1;
        i++
      ) {
        for (
          j = Math.max(charNo - 1, 0);
          j <= lines[lineNo].length - 1 && j <= charNo + 1;
          j++
        ) {
          if (isDigit(lines[i][j])) {
            // console.log(getPartNumber(lines[i], j), i, j);
            parts.add(getPartNumber(lines[i], j));
          }
        }
      }

      [...parts].forEach((part) => {
        const count = partNumbers.get(part) ?? 0;

        partNumbers.set(part, count + 1);
      });

      if (c == "*" && parts.size == 2) {
        gearRatioSum += Array.from(parts.values()).reduce(
          (acc, part) => acc * part,
          1
        );
      }
    }
  });
});

const partSum = Array.from(partNumbers.entries()).reduce(
  (sum, [partNumber, count]) => sum + partNumber * count,
  0
);
// console.log(partNumbers);
console.log(partSum);
console.log(gearRatioSum);
