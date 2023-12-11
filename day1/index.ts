import * as fs from "fs";
import path from "path";

const isNumber = (value?: string | number): boolean => {
  return value != null && value !== "" && !isNaN(Number(value.toString()));
};

const getFirstDigit = (str: string): number => {
  for (let i = 0; i < str.length; i++) {
    if (isNumber(str[i])) {
      return Number(str[i]);
    }
  }
  return -1;
};

const getLastDigit = (str: string): number => {
  for (let i = str.trim().length - 1; i >= 0; i--) {
    if (isNumber(str[i])) {
      return Number(str[i]);
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

    // if (sum > 300) {
    //   break;
    // }
  }

  console.log(sum);
};

run();
