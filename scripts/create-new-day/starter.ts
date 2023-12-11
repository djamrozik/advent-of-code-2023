import * as fs from "fs";
import path from "path";

const run = async () => {
  const joinedPath = path.join(__dirname, "input.txt");
  const inputText = fs.readFileSync(joinedPath, "utf8");
  const inputTextLines = inputText.split("\n");

  let sum = 0;
  for (const line of inputTextLines) {
  }

  console.log(sum);
};

run();
