import * as fs from "fs";
import path from "path";

const maxGameCounts: { [key: string]: number } = {
  red: 12,
  green: 13,
  blue: 14,
};

const getIdFromGame = (game: string): number => {
  const splits = game.split(":");
  const gameText = splits[0];
  const gameId = gameText.split(" ")[1];
  return Number(gameId);
};

const getGames = (game: string): string[] => {
  const allGames = game.split(":")[1];
  return allGames.split(";").map((g) => g.trim());
};

const lineToObj = (line: string): { [key: string]: number } => {
  return line.split(", ").reduce((sum, cur) => {
    const countSplit = cur.split(" ");
    return {
      ...sum,
      [countSplit[1]]: Number(countSplit[0]),
    };
  }, {});
};

const isValidGame = (gameObj: { [key: string]: number }): boolean => {
  for (const color in gameObj) {
    if (!(color in maxGameCounts)) {
      throw new Error(`Invalid color ${color}`);
    }
    if (gameObj[color] > maxGameCounts[color]) {
      return false;
    }
  }
  return true;
};

// for part 2
const getMaxValueOfKeys = (
  objs: { [key: string]: number }[]
): { [key: string]: number } => {
  const res: { [key: string]: number } = {};
  for (const obj of objs) {
    for (const key in obj) {
      if (!(key in res)) {
        res[key] = obj[key];
        continue;
      }
      if (obj[key] > res[key]) {
        res[key] = obj[key];
      }
    }
  }
  return res;
};

const run = async () => {
  const joinedPath = path.join(__dirname, "input.txt");
  const inputText = fs.readFileSync(joinedPath, "utf8");
  const inputTextLines = inputText.split("\n");

  // -- Part 1

  let sum = 0;
  for (const line of inputTextLines) {
    const gameId = getIdFromGame(line);
    let isValid = true;
    for (const game of getGames(line)) {
      const gameObj = lineToObj(game);
      isValid = isValid && isValidGame(gameObj);
    }
    if (isValid) {
      sum += gameId;
    }
  }

  console.log("Part 1", sum);

  // -- Part 2

  sum = 0;
  for (const line of inputTextLines) {
    const allGameObjs = getGames(line).map(lineToObj);
    const maxValue = getMaxValueOfKeys(allGameObjs);
    sum += Object.values(maxValue).reduce((sum, cur) => {
      return sum * cur;
    }, 1);
  }

  console.log("Part 2", sum);
};

run();
