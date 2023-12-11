import * as fs from "fs";
import path from "path";

const wordNumMapping: { [key: string]: string } = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const isNumber = (value?: string | number): boolean => {
  return value != null && value !== "" && !isNaN(Number(value.toString()));
};

const getFirstDigit = (str: string): number => {
  for (let i = 0; i < str.length; i++) {
    if (isNumber(str[i])) {
      return Number(str[i]);
    }
    for (const word in wordNumMapping) {
      const start = i;
      const end = i + word.length;
      if (end >= str.length) {
        continue;
      }
      if (str.substring(start, end) === word) {
        return Number(wordNumMapping[word]);
      }
    }
  }
  return -1;
};

const getLastDigit = (str: string): number => {
  for (let i = str.trim().length - 1; i >= 0; i--) {
    if (isNumber(str[i])) {
      return Number(str[i]);
    }
    for (const word in wordNumMapping) {
      const end = i + 1;
      const start = i - word.length + 1;
      if (start < 0) {
        continue;
      }
      if (str.substring(start, end) === word) {
        return Number(wordNumMapping[word]);
      }
    }
  }
  return -1;
};

const run = async () => {
  const joinedPath = path.join(__dirname, "input.txt");
  const inputText = fs.readFileSync(joinedPath, "utf8");
  const inputTextLines = inputText.split("\n");

  let sum = 0;
  for (const line of inputTextLines) {
    const firstDigit = getFirstDigit(line);
    const lastDigit = getLastDigit(line);
    sum += 10 * firstDigit;
    sum += lastDigit;
  }

  console.log(sum);
};

run();
