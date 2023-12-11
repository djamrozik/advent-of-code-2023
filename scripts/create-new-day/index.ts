import path from "path";
import * as fs from "fs";

const run = async () => {
  if (process.argv.length < 3) {
    throw new Error("No directory arg passed");
  }

  const dayName = process.argv[2];
  const newDayDirectory = path.join(__dirname, "..", "..", "src", dayName);

  if (fs.existsSync(newDayDirectory)) {
    throw new Error(`Directory for ${dayName} already exists`);
  }

  fs.mkdirSync(newDayDirectory);

  const inputFile = path.join(newDayDirectory, "input.txt");
  fs.closeSync(fs.openSync(inputFile, "w"));

  const starterFile = path.join(__dirname, "starter.ts");
  const targerStarterFile = path.join(newDayDirectory, "index.ts");
  fs.copyFileSync(starterFile, targerStarterFile);
};

run();
