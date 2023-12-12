import * as fs from 'fs'
import path from 'path'

interface PossiblePartNumber {
  fullNumber: number
  line: number // 0 is the first line, 1 is next, ...
  index: number // the starting index
}

interface PossibleGear {
  line: number
  index: number
}

const isNumber = (value?: string | number): boolean => {
  return value != null && value !== '' && !isNaN(Number(value.toString()))
}

const getPossiblePartNumbers = (line: string, lineIdx: number): PossiblePartNumber[] => {
  let res = []
  let i = 0

  while (i < line.length) {
    if (!isNumber(line[i])) {
      i++
      continue
    }

    let curNum = line[i]
    let j = i + 1

    while (j < line.length && isNumber(line[j])) {
      curNum += line[j]
      j++
    }

    res.push({
      fullNumber: Number(curNum),
      line: lineIdx,
      index: i,
    })

    i += curNum.length
  }

  return res
}

// will return false if the position given is out of bounds
const isSymbol = (lines: string[], lineIdx: number, idx: number): boolean => {
  if (lineIdx < 0 || lineIdx >= lines.length) {
    return false
  }
  const line = lines[lineIdx]
  if (idx < 0 || idx >= line.length) {
    return false
  }
  if (isNumber(line[idx])) {
    return false
  }
  if (line[idx] === '.') {
    return false
  }
  return true
}

const isValidPartNumber = (lines: string[], possiblePartNumber: PossiblePartNumber): boolean => {
  // check top of possible part number
  let start = possiblePartNumber.index - 1
  let end = start + possiblePartNumber.fullNumber.toString().length + 1
  for (let i = start; i <= end; i++) {
    if (isSymbol(lines, possiblePartNumber.line - 1, i)) {
      return true
    }
  }

  // check left
  if (isSymbol(lines, possiblePartNumber.line, possiblePartNumber.index - 1)) {
    return true
  }

  // check right
  if (isSymbol(lines, possiblePartNumber.line, possiblePartNumber.index + possiblePartNumber.fullNumber.toString().length)) {
    return true
  }

  // check top of possible part number
  start = possiblePartNumber.index - 1
  end = start + possiblePartNumber.fullNumber.toString().length + 1
  for (let i = start; i <= end; i++) {
    if (isSymbol(lines, possiblePartNumber.line + 1, i)) {
      return true
    }
  }

  return false
}

const getAllPossibleGears = (lines: string[]): PossibleGear[] => {
  let res: PossibleGear[] = []
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] === '*') {
        res.push({
          line: i,
          index: j,
        })
      }
    }
  }
  return res
}

// both the part number and gear are assumed to be in valid positions
const isGearAdjacent = (partNumber: PossiblePartNumber, possibleGear: PossibleGear): boolean => {
  // on the same line
  if (partNumber.line === possibleGear.line) {
    if (possibleGear.index === partNumber.index - 1) {
      return true
    }
    if (possibleGear.index === partNumber.index + partNumber.fullNumber.toString().length) {
      return true
    }
  }

  // difference of one line
  if (Math.abs(possibleGear.line - partNumber.line) === 1) {
    if (
      possibleGear.index >= partNumber.index - 1 &&
      possibleGear.index <= partNumber.index + partNumber.fullNumber.toString().length
    ) {
      return true
    }
  }

  return false
}

const run = async () => {
  const joinedPath = path.join(__dirname, 'input.txt')
  const inputText = fs.readFileSync(joinedPath, 'utf8')
  const inputTextLines = inputText.split('\n')

  // Part 1

  const possiblePartNumbers: PossiblePartNumber[] = []
  for (let i = 0; i < inputTextLines.length; i++) {
    possiblePartNumbers.push(...getPossiblePartNumbers(inputTextLines[i], i))
  }

  const validPartNumbers = possiblePartNumbers.filter((x) => {
    return isValidPartNumber(inputTextLines, x)
  })

  let sum = validPartNumbers
    .map((x) => x.fullNumber)
    .reduce((sum, cur) => {
      return sum + cur
    }, 0)

  console.log('Part 1', sum)

  // Part 2

  sum = 0

  const possibleGears = getAllPossibleGears(inputTextLines)
  for (const possibleGear of possibleGears) {
    const adjacentPartNumbers: PossiblePartNumber[] = []
    for (const validPartNumber of validPartNumbers) {
      if (isGearAdjacent(validPartNumber, possibleGear)) {
        adjacentPartNumbers.push(validPartNumber)
      }
    }
    if (adjacentPartNumbers.length > 2) {
      throw new Error('More than 2 adjacent part numbers!')
    }
    if (adjacentPartNumbers.length === 2) {
      sum += adjacentPartNumbers[0].fullNumber * adjacentPartNumbers[1].fullNumber
    }
  }

  console.log('Part 2', sum)
}

run()
